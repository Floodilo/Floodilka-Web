/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, MessageID, UserID} from '~/BrandedTypes';
import {GuildOperations} from '~/Constants';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {Channel} from '~/Models';
import type {ReadStateService} from '~/read_state/ReadStateService';
import type {AuthenticatedChannel} from '../AuthenticatedChannel';
import {MessageInteractionBase} from './MessageInteractionBase';

export class MessageReadStateService extends MessageInteractionBase {
	constructor(
		gatewayService: IGatewayService,
		private readStateService: ReadStateService,
	) {
		super(gatewayService);
	}

	async startTyping({authChannel, userId}: {authChannel: AuthenticatedChannel; userId: UserID}): Promise<void> {
		const {channel, guild} = authChannel;
		this.ensureTextChannel(channel);

		if (this.isOperationDisabled(guild, GuildOperations.TYPING_EVENTS)) {
			return;
		}

		await this.dispatchTypingStart({channel, userId});
	}

	async ackMessage({
		userId,
		channelId,
		messageId,
		mentionCount,
		manual,
	}: {
		userId: UserID;
		channelId: ChannelID;
		messageId: MessageID;
		mentionCount: number;
		manual?: boolean;
	}): Promise<void> {
		await this.readStateService.ackMessage({userId, channelId, messageId, mentionCount, manual});
	}

	async deleteReadState({userId, channelId}: {userId: UserID; channelId: ChannelID}): Promise<void> {
		await this.readStateService.deleteReadState({userId, channelId});
	}

	async ackPins({
		userId,
		channelId,
		timestamp,
	}: {
		userId: UserID;
		channelId: ChannelID;
		timestamp: Date;
	}): Promise<void> {
		await this.readStateService.ackPins({userId, channelId, timestamp});
	}

	private async dispatchTypingStart({channel, userId}: {channel: Channel; userId: UserID}): Promise<void> {
		await this.dispatchEvent({
			channel,
			event: 'TYPING_START',
			data: {
				channel_id: channel.id.toString(),
				user_id: userId.toString(),
				timestamp: Date.now(),
			},
		});
	}
}
