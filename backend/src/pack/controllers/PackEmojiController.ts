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

export const PackEmojiController = (app: HonoApp) => {
	app.post(
		'/packs/emojis/:pack_id',
		RateLimitMiddleware(RateLimitConfigs.PACKS_EMOJI_CREATE),
		LoginRequired,
		Validator('param', z.object({pack_id: Int64Type})),
		Validator('json', GuildEmojiCreateRequest),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			const {name, image} = ctx.req.valid('json');
			const user = ctx.get('user');
			return ctx.json(await ctx.get('packService').createPackEmoji({user, packId, name, image}));
		},
	);

	app.post(
		'/packs/emojis/:pack_id/bulk',
		RateLimitMiddleware(RateLimitConfigs.PACKS_EMOJI_BULK_CREATE),
		LoginRequired,
		Validator('param', z.object({pack_id: Int64Type})),
		Validator('json', GuildEmojiBulkCreateRequest),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			const {emojis} = ctx.req.valid('json');
			const user = ctx.get('user');
			return ctx.json(await ctx.get('packService').bulkCreatePackEmojis({user, packId, emojis}));
		},
	);

	app.get(
		'/packs/emojis/:pack_id',
		RateLimitMiddleware(RateLimitConfigs.PACKS_EMOJIS_LIST),
		LoginRequired,
		Validator('param', z.object({pack_id: Int64Type})),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			const userId = ctx.get('user').id;
			const requestCache = ctx.get('requestCache');
			return ctx.json(await ctx.get('packService').getPackEmojis({userId, packId, requestCache}));
		},
	);

	app.patch(
		'/packs/emojis/:pack_id/:emoji_id',
		RateLimitMiddleware(RateLimitConfigs.PACKS_EMOJI_UPDATE),
		LoginRequired,
		Validator('param', z.object({pack_id: Int64Type, emoji_id: Int64Type})),
		Validator('json', GuildEmojiUpdateRequest),
		async (ctx) => {
			const {pack_id, emoji_id} = ctx.req.valid('param');
			const packId = createGuildID(pack_id);
			const emojiId = createEmojiID(emoji_id);
			const {name} = ctx.req.valid('json');
			return ctx.json(
				await ctx.get('packService').updatePackEmoji({userId: ctx.get('user').id, packId, emojiId, name}),
			);
		},
	);

	app.delete(
		'/packs/emojis/:pack_id/:emoji_id',
		RateLimitMiddleware(RateLimitConfigs.PACKS_EMOJI_DELETE),
		LoginRequired,
		Validator('param', z.object({pack_id: Int64Type, emoji_id: Int64Type})),
		Validator('query', z.object({purge: QueryBooleanType.optional()})),
		async (ctx) => {
			const {pack_id, emoji_id} = ctx.req.valid('param');
			const packId = createGuildID(pack_id);
			const emojiId = createEmojiID(emoji_id);
			const purge = ctx.req.valid('query').purge ?? false;
			await ctx.get('packService').deletePackEmoji({
				userId: ctx.get('user').id,
				packId,
				emojiId,
				purge,
			});
			return ctx.body(null, 204);
		},
	);
};
