/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task, TaskHelpers as JobHelpers} from '~/worker/TaskTypes';
import type {ChannelID, MessageID} from '~/BrandedTypes';
import {createChannelID, createMessageID, createUserID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import {getWorkerDependencies} from '../WorkerContext';
import {chunkArray, createBulkDeleteDispatcher} from './utils/messageDeletion';

interface MessageShredJobPayload {
	job_id: string;
	admin_user_id: string;
	target_user_id: string;
	entries: Array<{channel_id: string; message_id: string}>;
}

const INPUT_SLICE_SIZE = 500;
const VALIDATION_CHUNK_SIZE = 25;
const DELETION_CHUNK_SIZE = 10;
const STATUS_TTL_SECONDS = 3600;

const ensureValidPayload = (payload: unknown): void => {
	if (typeof payload !== 'object' || payload === null) {
		throw new Error('invalid payload');
	}

	const data = payload as MessageShredJobPayload;

	if (typeof data.job_id !== 'string' || data.job_id.length === 0) {
		throw new Error('invalid job_id');
	}
	if (typeof data.admin_user_id !== 'string' || data.admin_user_id.length === 0) {
		throw new Error('invalid admin_user_id');
	}
	if (typeof data.target_user_id !== 'string' || data.target_user_id.length === 0) {
		throw new Error('invalid target_user_id');
	}
	if (!Array.isArray(data.entries)) {
		throw new Error('entries must be an array');
	}
	for (const entry of data.entries) {
		if (
			typeof entry !== 'object' ||
			entry === null ||
			typeof entry.channel_id !== 'string' ||
			typeof entry.message_id !== 'string'
		) {
			throw new Error('invalid entry in payload');
		}
	}
};

async function messageShredTask(payload: unknown, helpers: JobHelpers) {
	const validatedPayload: unknown = payload;
	ensureValidPayload(validatedPayload);
	const data = validatedPayload as MessageShredJobPayload;
	helpers.logger.debug('Processing messageShred task', {payload: data});

	const {redis, channelRepository, gatewayService} = getWorkerDependencies();
	const progressKey = `message_shred_status:${data.job_id}`;
	const requestedEntries = data.entries.length;
	const startedAt = new Date().toISOString();

	let skippedCount = 0;
	let processedCount = 0;
	let totalValidCount = 0;

	const persistStatus = async (
		status: 'in_progress' | 'completed' | 'failed',
		extra?: {completed_at?: string; failed_at?: string; error?: string},
	) => {
		await redis.set(
			progressKey,
			JSON.stringify({
				status,
				requested: requestedEntries,
				total: totalValidCount,
				processed: processedCount,
				skipped: skippedCount,
				started_at: startedAt,
				...extra,
			}),
			'EX',
			STATUS_TTL_SECONDS,
		);
	};

	await persistStatus('in_progress');

	const authorId = createUserID(BigInt(data.target_user_id));
	const seen = new Set<string>();

	const bulkDeleteDispatcher = createBulkDeleteDispatcher({
		channelRepository,
		gatewayService,
		batchSize: DELETION_CHUNK_SIZE,
	});

	const processSlice = async (entriesSlice: Array<{channel_id: string; message_id: string}>) => {
		const typedSlice: Array<{channelId: ChannelID; messageId: MessageID}> = [];

		for (const entry of entriesSlice) {
			const key = `${entry.channel_id}:${entry.message_id}`;
			if (seen.has(key)) {
				skippedCount += 1;
				continue;
			}

			seen.add(key);

			try {
				typedSlice.push({
					channelId: createChannelID(BigInt(entry.channel_id)),
					messageId: createMessageID(BigInt(entry.message_id)),
				});
			} catch (error) {
				skippedCount += 1;
				helpers.logger.warn('Skipping malformed entry in message shred job', {error, entry});
			}
		}

		if (typedSlice.length === 0) {
			return;
		}

		for (const validationChunk of chunkArray(typedSlice, VALIDATION_CHUNK_SIZE)) {
			const existenceChecks = validationChunk.map(({channelId, messageId}) =>
				channelRepository.messages.authorHasMessage(authorId, channelId, messageId),
			);

			const results = await Promise.all(existenceChecks);
			const deletableChunk: Array<{channelId: ChannelID; messageId: MessageID}> = [];

			for (let i = 0; i < validationChunk.length; i++) {
				if (results[i]) {
					deletableChunk.push(validationChunk[i]);
				} else {
					skippedCount += 1;
				}
			}

			if (deletableChunk.length === 0) {
				await persistStatus('in_progress');
				continue;
			}

			totalValidCount += deletableChunk.length;
			await persistStatus('in_progress');

			for (const deletionChunk of chunkArray(deletableChunk, DELETION_CHUNK_SIZE)) {
				await Promise.all(
					deletionChunk.map(({channelId, messageId}) =>
						channelRepository.deleteMessage(channelId, messageId, authorId),
					),
				);

				processedCount += deletionChunk.length;
				await persistStatus('in_progress');

				for (const {channelId, messageId} of deletionChunk) {
					bulkDeleteDispatcher.track(channelId, messageId);
				}

				await bulkDeleteDispatcher.flush(true);
			}
		}
	};

	try {
		for (const entriesSlice of chunkArray(data.entries, INPUT_SLICE_SIZE)) {
			await processSlice(entriesSlice);
		}

		await persistStatus('completed', {
			completed_at: new Date().toISOString(),
		});
		await bulkDeleteDispatcher.flush(true);
	} catch (error) {
		Logger.error({error, job_id: data.job_id}, 'Failed to process message shred job');
		await persistStatus('failed', {
			failed_at: new Date().toISOString(),
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		throw error;
	}
}

const messageShred: Task = messageShredTask;

export default messageShred;
