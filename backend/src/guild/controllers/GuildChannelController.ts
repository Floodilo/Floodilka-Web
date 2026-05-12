/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createChannelID, createGuildID} from '~/BrandedTypes';
import {ChannelCreateRequest} from '~/channel/ChannelModel';
import {LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';

export const GuildChannelController = (app: HonoApp) => {
	app.get(
		'/guilds/:guild_id/channels',
		RateLimitMiddleware(RateLimitConfigs.GUILD_CHANNELS_LIST),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			const requestCache = ctx.get('requestCache');
			return ctx.json(await ctx.get('guildService').getChannels({userId, guildId, requestCache}));
		},
	);

	app.post(
		'/guilds/:guild_id/channels',
		RateLimitMiddleware(RateLimitConfigs.GUILD_CHANNEL_CREATE),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type})),
		Validator('json', ChannelCreateRequest),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			const data = ctx.req.valid('json');
			const requestCache = ctx.get('requestCache');
			const auditLogReason = ctx.get('auditLogReason') ?? null;
			return ctx.json(
				await ctx.get('guildService').createChannel({userId, guildId, data, requestCache}, auditLogReason),
			);
		},
	);

	app.patch(
		'/guilds/:guild_id/channels',
		RateLimitMiddleware(RateLimitConfigs.GUILD_CHANNEL_POSITIONS),
		LoginRequired,
		Validator('param', z.object({guild_id: Int64Type})),
		Validator(
			'json',
			z.array(
				z.object({
					id: Int64Type,
					position: z.number().int().nonnegative().optional(),
					parent_id: Int64Type.nullish(),
					preceding_sibling_id: Int64Type.nullish(),
					lock_permissions: z.boolean().optional(),
				}),
			),
		),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			const payload = ctx.req.valid('json');
			const requestCache = ctx.get('requestCache');
			const auditLogReason = ctx.get('auditLogReason') ?? null;

			await ctx.get('guildService').updateChannelPositions(
				{
					userId,
					guildId,
					updates: payload.map((item) => ({
						channelId: createChannelID(item.id),
						position: item.position,
						parentId: item.parent_id == null ? item.parent_id : createChannelID(item.parent_id),
						precedingSiblingId:
							item.preceding_sibling_id == null
								? item.preceding_sibling_id
								: createChannelID(item.preceding_sibling_id),
						lockPermissions: item.lock_permissions ?? false,
					})),
					requestCache,
				},
				auditLogReason,
			);
			return ctx.body(null, 204);
		},
	);
};
