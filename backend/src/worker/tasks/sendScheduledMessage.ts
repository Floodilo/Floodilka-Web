/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {ScheduledMessageExecutor, type SendScheduledMessageParams} from '~/worker/executors/ScheduledMessageExecutor';
import {CommonFields, validatePayload} from '~/worker/utils/TaskPayloadValidator';
import {getWorkerDependencies} from '~/worker/WorkerContext';

const payloadSchema = {
	userId: CommonFields.userId(),
	scheduledMessageId: CommonFields.messageId(),
	expectedScheduledAt: {
		type: 'string' as const,
		requirement: 'required' as const,
	},
};

export const sendScheduledMessage: Task = async (payload, helpers) => {
	const validated = validatePayload<SendScheduledMessageParams>(payload, payloadSchema);
	const deps = getWorkerDependencies();
	const executor = new ScheduledMessageExecutor(deps, helpers.logger);
	await executor.execute(validated);
};
