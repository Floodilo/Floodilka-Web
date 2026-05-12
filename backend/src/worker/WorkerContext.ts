/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {WorkerDependencies} from './WorkerDependencies';

let workerDependencies: WorkerDependencies | null = null;

export function setWorkerDependencies(dependencies: WorkerDependencies): void {
	workerDependencies = dependencies;
}

export function getWorkerDependencies(): WorkerDependencies {
	if (!workerDependencies) {
		throw new Error('Worker dependencies have not been initialized. Call setWorkerDependencies() first.');
	}
	return workerDependencies;
}
