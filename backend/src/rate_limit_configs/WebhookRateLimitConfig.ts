/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export const WebhookRateLimitConfigs = {
	WEBHOOK_LIST_GUILD: {
		bucket: 'webhook:list::guild_id',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	WEBHOOK_LIST_CHANNEL: {
		bucket: 'webhook:list::channel_id',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	WEBHOOK_CREATE: {
		bucket: 'webhook:create::channel_id',
		config: {limit: 10, windowMs: 60000},
	} as RouteRateLimitConfig,

	WEBHOOK_GET: {
		bucket: 'webhook:read::webhook_id',
		config: {limit: 100, windowMs: 10000},
	} as RouteRateLimitConfig,

	WEBHOOK_UPDATE: {
		bucket: 'webhook:update::webhook_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	WEBHOOK_DELETE: {
		bucket: 'webhook:delete::webhook_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	WEBHOOK_EXECUTE: {
		bucket: 'webhook:execute::webhook_id',
		config: {limit: 60, windowMs: 60000, exemptFromGlobal: true},
	} as RouteRateLimitConfig,

	WEBHOOK_GITHUB: {
		bucket: 'webhook:github::webhook_id',
		config: {limit: 200, windowMs: 60000, exemptFromGlobal: true},
	} as RouteRateLimitConfig,
} as const;
