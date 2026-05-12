/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createEmojiID, createGuildID} from '~/BrandedTypes';
import {GuildEmojiBulkCreateRequest, GuildEmojiCreateRequest, GuildEmojiUpdateRequest} from '~/guild/GuildModel';
import {LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type, QueryBooleanType, z} from '~/Schema';
import {Validator} from '~/Validator';

export const GuildEmojiController = (app: HonoApp) => {
	app.post(
		'/guilds/:guild_id/emojis',
		RateLimitMiddleware(RateLimitConfigs.GUILD_EMOJI_CREATE),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type})),
		Validator('json', GuildEmojiCreateRequest),
		async (ctx) => {
			const user = ctx.get('user');
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			const {name, image} = ctx.req.valid('json');
			const auditLogReason = ctx.get('auditLogReason') ?? null;
			return ctx.json(await ctx.get('guildService').createEmoji({user, guildId, name, image}, auditLogReason));
		},
	);

	app.post(
		'/guilds/:guild_id/emojis/bulk',
		RateLimitMiddleware(RateLimitConfigs.GUILD_EMOJI_BULK_CREATE),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type})),
		Validator('json', GuildEmojiBulkCreateRequest),
		async (ctx) => {
			const user = ctx.get('user');
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			const {emojis} = ctx.req.valid('json');
			const auditLogReason = ctx.get('auditLogReason') ?? null;
			return ctx.json(await ctx.get('guildService').bulkCreateEmojis({user, guildId, emojis}, auditLogReason));
		},
	);

	app.get(
		'/guilds/:guild_id/emojis',
		RateLimitMiddleware(RateLimitConfigs.GUILD_EMOJIS_LIST),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type})),
		async (ctx) => {
			const {guild_id} = ctx.req.valid('param');
			const userId = ctx.get('user').id;
			const guildId = createGuildID(guild_id);
			const requestCache = ctx.get('requestCache');
			return ctx.json(await ctx.get('guildService').getEmojis({userId, guildId, requestCache}));
		},
	);

	app.patch(
		'/guilds/:guild_id/emojis/:emoji_id',
		RateLimitMiddleware(RateLimitConfigs.GUILD_EMOJI_UPDATE),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type, emoji_id: Int64Type})),
		Validator('json', GuildEmojiUpdateRequest),
		async (ctx) => {
			const {guild_id, emoji_id} = ctx.req.valid('param');
			const userId = ctx.get('user').id;
			const guildId = createGuildID(guild_id);
			const emojiId = createEmojiID(emoji_id);
			const {name} = ctx.req.valid('json');
			const auditLogReason = ctx.get('auditLogReason') ?? null;
			return ctx.json(await ctx.get('guildService').updateEmoji({userId, guildId, emojiId, name}, auditLogReason));
		},
	);

	app.delete(
		'/guilds/:guild_id/emojis/:emoji_id',
		RateLimitMiddleware(RateLimitConfigs.GUILD_EMOJI_DELETE),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type, emoji_id: Int64Type})),
		Validator('query', z.object({purge: QueryBooleanType.optional()})),
		async (ctx) => {
			const {guild_id, emoji_id} = ctx.req.valid('param');
			const userId = ctx.get('user').id;
			const guildId = createGuildID(guild_id);
			const emojiId = createEmojiID(emoji_id);
			const auditLogReason = ctx.get('auditLogReason') ?? null;
			const {purge = false} = ctx.req.valid('query');
			await ctx.get('guildService').deleteEmoji({userId, guildId, emojiId, purge}, auditLogReason);
			return ctx.body(null, 204);
		},
	);
};
