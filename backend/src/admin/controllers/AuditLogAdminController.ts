/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {AdminACLs} from '~/Constants';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Validator} from '~/Validator';
import {ListAuditLogsRequest, SearchAuditLogsRequest} from '../AdminModel';

export const AuditLogAdminController = (app: HonoApp) => {
	app.post(
		'/admin/audit-logs',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_AUDIT_LOG),
		requireAdminACL(AdminACLs.AUDIT_LOG_VIEW),
		Validator('json', ListAuditLogsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.listAuditLogs(ctx.req.valid('json')));
		},
	);

	app.post(
		'/admin/audit-logs/search',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_AUDIT_LOG),
		requireAdminACL(AdminACLs.AUDIT_LOG_VIEW),
		Validator('json', SearchAuditLogsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			return ctx.json(await adminService.searchAuditLogs(ctx.req.valid('json')));
		},
	);
};
