/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {JobsOptions} from 'bullmq';
import {Logger} from '~/Logger';
import {getQueue} from './BullMQConnection';
import type {IWorkerService, WorkerJobOptions, WorkerJobPayload} from './IWorkerService';

function toBullMQOptions(options?: WorkerJobOptions): JobsOptions {
	if (!options) return {};
	const opts: JobsOptions = {};
	if (options.runAt) {
		const delay = options.runAt.getTime() - Date.now();
		opts.delay = Math.max(delay, 0);
	}
	if (options.maxAttempts !== undefined) {
		opts.attempts = options.maxAttempts;
	}
	if (options.jobKey !== undefined) {
		opts.jobId = options.jobKey;
	}
	if (options.priority !== undefined) {
		opts.priority = options.priority;
	}
	return opts;
}

export class WorkerService implements IWorkerService {
	async addJob<TPayload extends WorkerJobPayload = WorkerJobPayload>(
		taskType: string,
		payload: TPayload,
		options?: WorkerJobOptions,
	): Promise<void> {
		try {
			const queue = getQueue();
			await queue.add(taskType, payload, toBullMQOptions(options));
			Logger.debug({taskType, payload}, 'Job queued successfully');
		} catch (error) {
			Logger.error({error, taskType, payload}, 'Failed to queue job');
			throw error;
		}
	}
}
