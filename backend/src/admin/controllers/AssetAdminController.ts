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
import {AdminRateLimitConfigs} from '~/rate_limit_configs/AdminRateLimitConfig';
import {Validator} from '~/Validator';
import {PurgeGuildAssetsRequest} from '../AdminModel';

export const AssetAdminController = (app: HonoApp) => {
	app.post(
		'/admin/assets/purge',
		RateLimitMiddleware(AdminRateLimitConfigs.ADMIN_GUILD_MODIFY),
		requireAdminACL(AdminACLs.ASSET_PURGE),
		Validator('json', PurgeGuildAssetsRequest),
		async (ctx) => {
			const adminService = ctx.get('adminService');
			const adminUserId = ctx.get('adminUserId');
			const auditLogReason = ctx.get('auditLogReason');
			return ctx.json(await adminService.purgeGuildAssets(ctx.req.valid('json'), adminUserId, auditLogReason));
		},
	);
};
