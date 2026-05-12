/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {WorkerJobOptions, WorkerJobPayload} from './IWorkerService';

export interface TaskLogger {
	debug(msg: string, meta?: object): void;
	debug(obj: object, msg?: string): void;
	info(msg: string, meta?: object): void;
	info(obj: object, msg?: string): void;
	warn(msg: string, meta?: object): void;
	warn(obj: object, msg?: string): void;
	error(msg: string, meta?: object): void;
	error(obj: object, msg?: string): void;
}

export interface TaskHelpers {
	logger: TaskLogger;
	addJob<TPayload extends WorkerJobPayload = WorkerJobPayload>(
		taskType: string,
		payload: TPayload,
		options?: WorkerJobOptions,
	): Promise<void>;
}

export type Task<P extends WorkerJobPayload = WorkerJobPayload> = (
	payload: P,
	helpers: TaskHelpers,
) => Promise<void>;
