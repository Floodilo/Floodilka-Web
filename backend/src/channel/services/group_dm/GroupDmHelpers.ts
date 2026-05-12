/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {AttachmentDecayService} from '~/attachment/AttachmentDecayService';
import {type ChannelID, channelIdToUserId, type MessageID, type UserID} from '~/BrandedTypes';
import {ChannelTypes, type GatewayDispatchEvent} from '~/Constants';
import {mapChannelToResponse} from '~/channel/ChannelModel';
import {collectMessageAttachments} from '~/channel/services/message/MessageHelpers';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {IMediaService} from '~/infrastructure/IMediaService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {Channel, Message} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';

export async function dispatchChannelDelete({
	channel,
	requestCache,
	userCacheService,
	gatewayService,
}: {
	channel: Channel;
	requestCache: RequestCache;
	userCacheService: UserCacheService;
	gatewayService: IGatewayService;
}): Promise<void> {
	const channelResponse = await mapChannelToResponse({
		channel,
		currentUserId: null,
		userCacheService,
		requestCache,
	});

	await dispatchEvent({
		channel,
		event: 'CHANNEL_DELETE',
		data: channelResponse,
		gatewayService,
	});
}

export async function dispatchMessageCreate({
	channel,
	message,
	requestCache,
	currentUserId,
	nonce,
	userCacheService,
	gatewayService,
	mediaService,
	getReferencedMessage,
}: {
	channel: Channel;
	message: Message;
	requestCache: RequestCache;
	currentUserId?: UserID;
	nonce?: string;
	userCacheService: UserCacheService;
	gatewayService: IGatewayService;
	mediaService: IMediaService;
	getReferencedMessage?: (channelId: ChannelID, messageId: MessageID) => Promise<Message | null>;
}): Promise<void> {
	const decayService = new AttachmentDecayService();
	const messageAttachments = collectMessageAttachments(message);
	const attachmentDecayMap =
		messageAttachments.length > 0
			? await decayService.fetchMetadata(messageAttachments.map((att) => ({attachmentId: att.id})))
			: undefined;
	const messageResponse = await (async () => {
		const {mapMessageToResponse} = await import('~/channel/ChannelModel');
		return mapMessageToResponse({
			message,
			currentUserId,
			nonce,
			userCacheService,
			requestCache,
			mediaService,
			attachmentDecayMap,
			getReferencedMessage,
		});
	})();

	await dispatchEvent({
		channel,
		event: 'MESSAGE_CREATE',
		data: {...messageResponse, channel_type: channel.type},
		gatewayService,
	});
}

async function dispatchEvent(params: {
	channel: Channel;
	event: GatewayDispatchEvent;
	data: unknown;
	gatewayService: IGatewayService;
}): Promise<void> {
	const {channel, event, data, gatewayService} = params;

	if (channel.type === ChannelTypes.DM_PERSONAL_NOTES) {
		return gatewayService.dispatchPresence({
			userId: channelIdToUserId(channel.id),
			event,
			data,
		});
	}

	if (channel.guildId) {
		return gatewayService.dispatchGuild({guildId: channel.guildId, event, data});
	} else {
		for (const recipientId of channel.recipientIds) {
			await gatewayService.dispatchPresence({userId: recipientId, event, data});
		}
	}
}
