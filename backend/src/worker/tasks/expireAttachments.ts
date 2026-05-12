/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {AttachmentDecayRepository} from '~/attachment/AttachmentDecayRepository';
import {Config} from '~/Config';
import {makeAttachmentCdnKey, makeAttachmentCdnUrl} from '~/channel/services/message/MessageHelpers';
import {getMetricsService} from '~/infrastructure/MetricsService';
import {Logger} from '~/Logger';
import {getExpiryBucket} from '~/utils/AttachmentDecay';
import {getWorkerDependencies} from '../WorkerContext';

const BUCKET_LOOKBACK_DAYS = 3;
const FETCH_LIMIT = 200;

export async function processExpiredAttachments(now = new Date()): Promise<void> {
	if (!Config.attachmentDecayEnabled) {
		Logger.info('Attachment decay disabled; skipping expireAttachments task');
		return;
	}

	const {assetDeletionQueue} = getWorkerDependencies();
	const repo = new AttachmentDecayRepository();
	const metrics = getMetricsService();

	let totalQueued = 0;
	let totalDeletedRows = 0;

	for (let offset = 0; offset <= BUCKET_LOOKBACK_DAYS; offset++) {
		const bucketDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
		const bucket = getExpiryBucket(bucketDate);

		while (true) {
			const expired = await repo.fetchExpiredByBucket(bucket, now, FETCH_LIMIT);
			if (expired.length === 0) break;

			for (const row of expired) {
				const metadata = await repo.fetchById(row.attachment_id);

				if (!metadata) {
					await repo.deleteRecords({
						expiry_bucket: row.expiry_bucket,
						expires_at: row.expires_at,
						attachment_id: row.attachment_id,
					});
					totalDeletedRows++;
					continue;
				}

				if (metadata.expires_at > row.expires_at) {
					await repo.deleteRecords({
						expiry_bucket: row.expiry_bucket,
						expires_at: row.expires_at,
						attachment_id: row.attachment_id,
					});
					totalDeletedRows++;
					continue;
				}

				const s3Key = makeAttachmentCdnKey(metadata.channel_id, metadata.attachment_id, metadata.filename);
				const cdnUrl = makeAttachmentCdnUrl(metadata.channel_id, metadata.attachment_id, metadata.filename);

				await assetDeletionQueue.queueDeletion({
					s3Key,
					cdnUrl,
					reason: 'attachment-decay-expired',
				});

				await repo.deleteRecords({
					expiry_bucket: row.expiry_bucket,
					expires_at: row.expires_at,
					attachment_id: row.attachment_id,
				});

				metrics.counter({
					name: 'attachment.expired',
					dimensions: {
						channel_id: metadata.channel_id.toString(),
						action: 'expiry',
					},
				});
				metrics.counter({
					name: 'attachment.storage.bytes',
					dimensions: {
						channel_id: metadata.channel_id.toString(),
						action: 'expiry',
					},
					value: -Number(metadata.size_bytes),
				});

				totalQueued++;
				totalDeletedRows++;
			}
		}
	}

	Logger.info(
		{
			queuedForDeletion: totalQueued,
			expiryRowsRemoved: totalDeletedRows,
			lookbackDays: BUCKET_LOOKBACK_DAYS,
		},
		'Processed attachment decay expiry buckets',
	);
}

const expireAttachments: Task = async () => {
	await processExpiredAttachments();
};

export default expireAttachments;
