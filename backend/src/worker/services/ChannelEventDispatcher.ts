/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {channelIdToUserId, type MessageID} from '~/BrandedTypes';
import {ChannelTypes, type GatewayDispatchEvent} from '~/Constants';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {Channel} from '~/Models';

interface ChannelEventDispatcherDeps {
	gatewayService: IGatewayService;
}

export class ChannelEventDispatcher {
	constructor(private readonly deps: ChannelEventDispatcherDeps) {}

	async dispatchToChannel(channel: Channel, event: GatewayDispatchEvent, data: unknown): Promise<void> {
		if (channel.type === ChannelTypes.DM_PERSONAL_NOTES) {
			return this.deps.gatewayService.dispatchPresence({
				userId: channelIdToUserId(channel.id),
				event,
				data,
			});
		}

		if (channel.guildId) {
			return this.deps.gatewayService.dispatchGuild({
				guildId: channel.guildId,
				event,
				data,
			});
		}

		for (const recipientId of channel.recipientIds) {
			await this.deps.gatewayService.dispatchPresence({
				userId: recipientId,
				event,
				data,
			});
		}
	}

	async dispatchBulkDelete(channel: Channel, messageIds: Array<MessageID>): Promise<void> {
		if (messageIds.length === 0) {
			return;
		}

		await this.dispatchToChannel(channel, 'MESSAGE_DELETE_BULK', {
			channel_id: channel.id.toString(),
			ids: messageIds.map((id) => id.toString()),
		});
	}

	async dispatchMessageUpdate(channel: Channel, messageData: unknown): Promise<void> {
		await this.dispatchToChannel(channel, 'MESSAGE_UPDATE', messageData);
	}

	async dispatchMessageDelete(
		channel: Channel,
		messageId: MessageID,
		content?: string,
		authorId?: string,
	): Promise<void> {
		await this.dispatchToChannel(channel, 'MESSAGE_DELETE', {
			channel_id: channel.id.toString(),
			id: messageId.toString(),
			content,
			author_id: authorId,
		});
	}
}
