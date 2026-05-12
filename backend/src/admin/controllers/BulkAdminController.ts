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
import {
	BulkAddGuildMembersRequest,
	BulkScheduleUserDeletionRequest,
	BulkUpdateGuildFeaturesRequest,
	BulkUpdateUserFlagsRequest,
} from '../AdminModel';

export const BulkAdminController = (app: HonoApp) => {
	app.post(
		'/admin/bulk/update-user-flags',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BULK_OPERATION),
		requireAdminACL(AdminACLs.BULK_UPDATE_USER_FLAGS),
		Validator('json', BulkUpdateUserFlagsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.bulkUpdateUserFlags(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bulk/update-guild-features',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BULK_OPERATION),
		requireAdminACL(AdminACLs.BULK_UPDATE_GUILD_FEATURES),
		Validator('json', BulkUpdateGuildFeaturesRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.bulkUpdateGuildFeatures(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bulk/add-guild-members',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BULK_OPERATION),
		requireAdminACL(AdminACLs.BULK_ADD_GUILD_MEMBERS),
		Validator('json', BulkAddGuildMembersRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.bulkAddGuildMembers(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);

	app.post(
		'/admin/bulk/schedule-user-deletion',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_BULK_OPERATION),
		requireAdminACL(AdminACLs.BULK_DELETE_USERS),
		Validator('json', BulkScheduleUserDeletionRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.bulkScheduleUserDeletion(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);
};
