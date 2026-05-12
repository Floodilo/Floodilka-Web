/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RouteRateLimitConfig} from '~/middleware/RateLimitMiddleware';

export const ChannelRateLimitConfigs = {
	CHANNEL_GET: {
		bucket: 'channel:read::channel_id',
		config: {limit: 100, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_UPDATE: {
		bucket: 'channel:update::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_DELETE: {
		bucket: 'channel:delete::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_READ_STATE_DELETE: {
		bucket: 'channel:read_state:delete::channel_id',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGES_GET: {
		bucket: 'channel:messages:read::channel_id',
		config: {limit: 100, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGE_GET: {
		bucket: 'channel:message:read::channel_id',
		config: {limit: 100, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGE_CREATE: {
		bucket: 'channel:message:create::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGE_UPDATE: {
		bucket: 'channel:message:update::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGE_DELETE: {
		bucket: 'channel:message:delete::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGE_BULK_DELETE: {
		bucket: 'channel:message:bulk_delete::channel_id',
		config: {limit: 10, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_MESSAGE_ACK: {
		bucket: 'channel:message:ack::channel_id',
		config: {limit: 100, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_SEARCH: {
		bucket: 'channel:search::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_ATTACHMENT_UPLOAD: {
		bucket: 'channel:attachment:upload::channel_id',
		config: {limit: 10, windowMs: 10000},
	} as RouteRateLimitConfig,

	ATTACHMENT_DELETE: {
		bucket: 'attachment:delete',
		config: {limit: 40, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_TYPING: {
		bucket: 'channel:typing::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_PINS: {
		bucket: 'channel:pins::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_REACTIONS: {
		bucket: 'channel:reactions::channel_id',
		config: {limit: 30, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_CALL_GET: {
		bucket: 'channel:call:get::channel_id',
		config: {limit: 60, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_CALL_UPDATE: {
		bucket: 'channel:call:update::channel_id',
		config: {limit: 10, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_CALL_RING: {
		bucket: 'channel:call:ring::channel_id',
		config: {limit: 5, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_CALL_STOP_RINGING: {
		bucket: 'channel:call:stop_ringing::channel_id',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_STREAM_UPDATE: {
		bucket: 'channel:stream:update::stream_key',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_STREAM_PREVIEW_GET: {
		bucket: 'channel:stream:preview:get::stream_key',
		config: {limit: 60, windowMs: 10000},
	} as RouteRateLimitConfig,

	CHANNEL_STREAM_PREVIEW_POST: {
		bucket: 'channel:stream:preview:post::stream_key',
		config: {limit: 20, windowMs: 10000},
	} as RouteRateLimitConfig,
} as const;
