/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {createGuildID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import {CommonFields, validatePayload} from '../utils/TaskPayloadValidator';
import {getWorkerDependencies} from '../WorkerContext';

interface BatchGuildAuditLogMessageDeletesPayload {
	guildId: string;
}

const payloadSchema = {
	guildId: CommonFields.guildId(),
};

const BATCH_LIMIT = 250;

const batchGuildAuditLogMessageDeletes: Task = async (payload, helpers) => {
	const validated = validatePayload<BatchGuildAuditLogMessageDeletesPayload>(payload, payloadSchema);
	helpers.logger.debug('Processing batchGuildAuditLogMessageDeletes task', {payload: validated});

	const guildId = createGuildID(BigInt(validated.guildId));
	const {guildAuditLogService} = getWorkerDependencies();

	try {
		const result = await guildAuditLogService.batchRecentMessageDeleteLogs(guildId, BATCH_LIMIT);

		if (result.deletedLogIds.length > 0) {
			Logger.info(
				{
					guildId: guildId.toString(),
					deletedCount: result.deletedLogIds.length,
					createdCount: result.createdLogs.length,
				},
				'Batched consecutive message delete audit logs',
			);
		} else {
			Logger.debug({guildId: guildId.toString()}, 'No consecutive message delete audit logs found to batch');
		}
	} catch (error) {
		Logger.error({error, guildId: guildId.toString()}, 'Failed to batch guild audit log message deletes');
		throw error;
	}
};

export default batchGuildAuditLogMessageDeletes;
