/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMessageID, type GuildID, type UserID} from '~/BrandedTypes';
import {MessageTypes} from '~/Constants';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {SnowflakeService} from '~/infrastructure/SnowflakeService';
import type {Channel, Message} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import type {IChannelRepositoryAggregate} from '../../repositories/IChannelRepositoryAggregate';
import type {MessagePersistenceService} from './MessagePersistenceService';

export class MessageSystemService {
	constructor(
		private channelRepository: IChannelRepositoryAggregate,
		private guildRepository: IGuildRepository,
		private snowflakeService: SnowflakeService,
		private persistenceService: MessagePersistenceService,
	) {}

	async sendJoinSystemMessage({
		guildId,
		userId,
		requestCache,
		dispatchMessageCreate,
	}: {
		guildId: GuildID;
		userId: UserID;
		requestCache: RequestCache;
		dispatchMessageCreate: (params: {channel: Channel; message: Message; requestCache: RequestCache}) => Promise<void>;
	}): Promise<void> {
		const guild = await this.guildRepository.findUnique(guildId);
		if (!guild?.systemChannelId) return;

		const systemChannel = await this.channelRepository.channelData.findUnique(guild.systemChannelId);
		if (!systemChannel) return;

		const messageId = createMessageID(this.snowflakeService.generate());
		const message = await this.persistenceService.createMessage({
			messageId,
			channelId: systemChannel.id,
			userId,
			type: MessageTypes.USER_JOIN,
			content: null,
			flags: 0,
			guildId,
			channel: systemChannel,
		});

		await dispatchMessageCreate({channel: systemChannel, message, requestCache});
	}
}
