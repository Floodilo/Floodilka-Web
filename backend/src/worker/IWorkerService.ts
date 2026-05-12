/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type WorkerJobPayload = object;

export interface WorkerJobOptions {
	queueName?: string;
	runAt?: Date;
	maxAttempts?: number;
	jobKey?: string;
	priority?: number;
	flags?: Array<string>;
}

export interface IWorkerService {
	addJob<TPayload extends WorkerJobPayload = WorkerJobPayload>(
		taskType: string,
		payload: TPayload,
		options?: WorkerJobOptions,
	): Promise<void>;
}
