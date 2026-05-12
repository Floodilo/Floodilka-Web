/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {InputValidationError} from '~/Errors';
import {AuditLogReasonType} from '~/Schema';

export const AuditLogMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	const auditLogReasonHeader = ctx.req.header('X-Audit-Log-Reason');

	if (auditLogReasonHeader) {
		const result = AuditLogReasonType.safeParse(auditLogReasonHeader);
		if (!result.success) {
			throw InputValidationError.create(
				'X-Audit-Log-Reason',
				result.error.issues[0]?.message ?? 'Некорректная причина в журнале аудита',
			);
		}
		ctx.set('auditLogReason', result.data);
	} else {
		ctx.set('auditLogReason', null);
	}

	await next();
});
