/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, UserID} from '~/BrandedTypes';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {IMediaService} from '~/infrastructure/IMediaService';
import type {SnowflakeService} from '~/infrastructure/SnowflakeService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {Channel} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import type {IUserRepository} from '~/user/IUserRepository';
import type {IChannelRepository} from '../IChannelRepository';
import type {GroupDmUpdateService} from './channel_data/GroupDmUpdateService';
import {GroupDmOperationsService} from './group_dm/GroupDmOperationsService';
import type {MessagePersistenceService} from './message/MessagePersistenceService';

export class GroupDmService {
	private operationsService: GroupDmOperationsService;

	constructor(
		channelRepository: IChannelRepository,
		userRepository: IUserRepository,
		guildRepository: IGuildRepository,
		userCacheService: UserCacheService,
		gatewayService: IGatewayService,
		mediaService: IMediaService,
		snowflakeService: SnowflakeService,
		groupDmUpdateService: GroupDmUpdateService,
		messagePersistenceService: MessagePersistenceService,
	) {
		this.operationsService = new GroupDmOperationsService(
			channelRepository,
			userRepository,
			guildRepository,
			userCacheService,
			gatewayService,
			mediaService,
			snowflakeService,
			groupDmUpdateService,
			messagePersistenceService,
		);
	}

	async addRecipientToChannel(params: {
		userId: UserID;
		channelId: ChannelID;
		recipientId: UserID;
		requestCache: RequestCache;
	}): Promise<Channel> {
		return this.operationsService.addRecipientToChannel(params);
	}

	async addRecipientViaInvite(params: {
		channelId: ChannelID;
		recipientId: UserID;
		inviterId?: UserID | null;
		requestCache: RequestCache;
	}): Promise<Channel> {
		return this.operationsService.addRecipientViaInvite(params);
	}

	async removeRecipientFromChannel(params: {
		userId: UserID;
		channelId: ChannelID;
		recipientId: UserID;
		requestCache: RequestCache;
		silent?: boolean;
	}): Promise<void> {
		return this.operationsService.removeRecipientFromChannel(params);
	}

	async updateGroupDmChannel(params: {
		userId: UserID;
		channelId: ChannelID;
		name?: string;
		icon?: string | null;
		ownerId?: UserID;
		nicks?: Record<string, string | null> | null;
		requestCache: RequestCache;
	}): Promise<Channel> {
		return this.operationsService.updateGroupDmChannel(params);
	}
}
