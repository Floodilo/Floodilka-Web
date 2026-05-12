/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export const AdminRateLimitConfigs = {
	ADMIN_LOOKUP: {
		bucket: 'admin:lookup',
		config: {limit: 200, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_USER_MODIFY: {
		bucket: 'admin:user:modify',
		config: {limit: 100, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_GUILD_MODIFY: {
		bucket: 'admin:guild:modify',
		config: {limit: 100, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_BAN_OPERATION: {
		bucket: 'admin:ban:operation',
		config: {limit: 60, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_BULK_OPERATION: {
		bucket: 'admin:bulk:operation',
		config: {limit: 20, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_GATEWAY_RELOAD: {
		bucket: 'admin:gateway:reload',
		config: {limit: 5, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_MESSAGE_OPERATION: {
		bucket: 'admin:message:operation',
		config: {limit: 100, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_CODE_GENERATION: {
		bucket: 'admin:code:generation',
		config: {limit: 30, windowMs: 60000},
	} as RouteRateLimitConfig,

	ADMIN_AUDIT_LOG: {
		bucket: 'admin:audit_log',
		config: {limit: 100, windowMs: 60000},
	} as RouteRateLimitConfig,
} as const;
