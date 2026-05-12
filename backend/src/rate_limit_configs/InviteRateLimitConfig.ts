/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export const InviteRateLimitConfigs = {
	INVITE_GET: {
		bucket: 'invite:read::invite_code',
		config: {limit: 100, windowMs: 10000},
	} as RouteRateLimitConfig,

	INVITE_ACCEPT: {
		bucket: 'invite:accept',
		config: {limit: 10, windowMs: 10000},
	} as RouteRateLimitConfig,

	INVITE_CREATE: {
		bucket: 'invite:create::channel_id',
		config: {limit: 20, windowMs: 60000},
	} as RouteRateLimitConfig,

	INVITE_DELETE: {
		bucket: 'invite:delete::invite_code',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	INVITE_LIST_CHANNEL: {
		bucket: 'invite:list::channel_id',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	INVITE_LIST_GUILD: {
		bucket: 'invite:list::guild_id',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,
} as const;
