/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {createChannelID, createMessageID} from '~/BrandedTypes';
import type {MessageSearchResponse} from '~/channel/ChannelModel';
import {mapMessageToResponse} from '~/channel/ChannelModel';
import type {IChannelRepository} from '~/channel/IChannelRepository';
import type {ChannelService} from '~/channel/services/ChannelService';
import type {IMediaService} from '~/infrastructure/IMediaService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {Message} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';

export class MessageSearchResponseMapper {
	constructor(
		private readonly channelRepository: IChannelRepository,
		private readonly channelService: ChannelService,
		private readonly userCacheService: UserCacheService,
		private readonly mediaService: IMediaService,
	) {}

	async mapSearchResultToResponses(
		result: {hits: Array<{channelId: string; id: string}>; total: number},
		userId: UserID,
		requestCache: RequestCache,
	): Promise<Array<MessageSearchResponse['messages'][number]>> {
		const messageEntries = result.hits.map((hit) => ({
			channelId: createChannelID(BigInt(hit.channelId)),
			messageId: createMessageID(BigInt(hit.id)),
		}));

		const messages = await Promise.all(
			messageEntries.map(({channelId, messageId}) => this.channelRepository.messages.getMessage(channelId, messageId)),
		);

		const validMessages = messages.filter((message): message is Message => message !== null);

		const messageResponses = await Promise.all(
			validMessages.map((message) =>
				mapMessageToResponse({
					message,
					currentUserId: userId,
					userCacheService: this.userCacheService,
					requestCache,
					mediaService: this.mediaService,
					getReactions: (channelId, messageId) =>
						this.channelService.getMessageReactions({
							userId,
							channelId,
							messageId,
						}),
				}),
			),
		);

		return messageResponses;
	}
}
