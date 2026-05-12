/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export const PackRateLimitConfigs = {
	PACKS_LIST: {
		bucket: 'packs:list',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_CREATE: {
		bucket: 'packs:create',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_UPDATE: {
		bucket: 'packs:update::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_DELETE: {
		bucket: 'packs:delete::pack_id',
		config: {limit: 10, windowMs: 60000},
	} as RouteRateLimitConfig,

	PACKS_INSTALL: {
		bucket: 'packs:install::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_INVITES_LIST: {
		bucket: 'packs:invite:list::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_INVITES_CREATE: {
		bucket: 'packs:invite:create::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_EMOJIS_LIST: {
		bucket: 'packs:emoji:list::pack_id',
		config: {limit: 60, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_EMOJI_CREATE: {
		bucket: 'packs:emoji:create::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_EMOJI_BULK_CREATE: {
		bucket: 'packs:emoji:bulk_create::pack_id',
		config: {limit: 6, windowMs: 60000},
	} as RouteRateLimitConfig,

	PACKS_EMOJI_UPDATE: {
		bucket: 'packs:emoji:update::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_EMOJI_DELETE: {
		bucket: 'packs:emoji:delete::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_STICKERS_LIST: {
		bucket: 'packs:sticker:list::pack_id',
		config: {limit: 60, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_STICKER_CREATE: {
		bucket: 'packs:sticker:create::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_STICKER_BULK_CREATE: {
		bucket: 'packs:sticker:bulk_create::pack_id',
		config: {limit: 6, windowMs: 60000},
	} as RouteRateLimitConfig,

	PACKS_STICKER_UPDATE: {
		bucket: 'packs:sticker:update::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	PACKS_STICKER_DELETE: {
		bucket: 'packs:sticker:delete::pack_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,
} as const;
