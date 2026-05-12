/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createChannelID, createGuildID} from '~/BrandedTypes';
import {MessageSearchRequest, type MessageSearchResponse} from '~/channel/ChannelModel';
import type {IChannelRepository} from '~/channel/IChannelRepository';
import type {ChannelService} from '~/channel/services/ChannelService';
import {ChannelIndexingError, InputValidationError} from '~/Errors';
import type {GuildService} from '~/guild/services/GuildService';
import type {IMediaService} from '~/infrastructure/IMediaService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type, z} from '~/Schema';
import {GlobalSearchService} from '~/search/GlobalSearchService';
import type {IUserRepository} from '~/user/IUserRepository';
import {Validator} from '~/Validator';
import type {IWorkerService} from '~/worker/IWorkerService';

const SearchMessagesRequest = MessageSearchRequest.extend({
	context_channel_id: Int64Type.optional(),
	context_guild_id: Int64Type.optional(),
	channel_ids: z.array(Int64Type).max(500).optional(),
});

export const SearchController = (app: HonoApp) => {
	app.post(
		'/search/messages',
		RateLimitMiddleware(RateLimitConfigs.SEARCH_MESSAGES),
		LoginRequired,
		DefaultUserOnly,
		Validator('json', SearchMessagesRequest),
		async (ctx) => {
			const params = ctx.req.valid('json');
			const userId = ctx.get('user').id;
			const requestCache = ctx.get('requestCache');
			const {channel_ids, context_channel_id, context_guild_id, ...searchParams} = params;
			const contextChannelId = context_channel_id ? createChannelID(context_channel_id) : null;
			const contextGuildId = context_guild_id ? createGuildID(context_guild_id) : null;
			const channelIds = channel_ids?.map((id) => createChannelID(id)) ?? [];

			const globalSearch = new GlobalSearchService(
				ctx.get('channelRepository') as IChannelRepository,
				ctx.get('channelService') as ChannelService,
				ctx.get('guildService') as GuildService,
				ctx.get('userRepository') as IUserRepository,
				ctx.get('userCacheService') as UserCacheService,
				ctx.get('mediaService') as IMediaService,
				ctx.get('workerService') as IWorkerService,
			);

			const scope = searchParams.scope ?? 'current';

			let result: MessageSearchResponse | {indexing: true};
			switch (scope) {
				case 'all_guilds':
					result = await ctx.get('guildService').searchAllGuilds({
						userId,
						channelIds,
						searchParams,
						requestCache,
					});
					break;
				case 'all_dms':
				case 'open_dms':
					result = await globalSearch.searchAcrossDms({
						userId,
						scope,
						searchParams,
						requestCache,
						includeChannelId: contextChannelId,
						requestedChannelIds: channelIds,
					});
					break;
				case 'all':
					result = await globalSearch.searchAcrossGuildsAndDms({
						userId,
						dmScope: 'all_dms',
						searchParams,
						requestCache,
						includeChannelId: contextChannelId,
						requestedChannelIds: channelIds,
					});
					break;
				case 'open_dms_and_all_guilds':
					result = await globalSearch.searchAcrossGuildsAndDms({
						userId,
						dmScope: 'open_dms',
						searchParams,
						requestCache,
						includeChannelId: contextChannelId,
						requestedChannelIds: channelIds,
					});
					break;
				default:
					if (contextGuildId) {
						result = await ctx.get('guildService').searchMessages({
							userId,
							guildId: contextGuildId,
							channelIds,
							searchParams,
							requestCache,
						});
					} else if (contextChannelId) {
						result = await ctx.get('channelService').searchMessages({
							userId,
							channelId: contextChannelId,
							searchParams,
							requestCache,
						});
					} else {
						throw InputValidationError.create('context', 'Требуется ID канала или сервера');
					}
					break;
			}

			if ('indexing' in result && result.indexing) {
				throw new ChannelIndexingError();
			}

			return ctx.json(result);
		},
	);
};
