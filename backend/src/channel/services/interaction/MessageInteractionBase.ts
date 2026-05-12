/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {channelIdToUserId} from '~/BrandedTypes';
import {ChannelTypes, type GatewayDispatchEvent, TEXT_BASED_CHANNEL_TYPES} from '~/Constants';
import {CannotSendMessageToNonTextChannelError} from '~/Errors';
import type {GuildResponse} from '~/guild/GuildModel';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {Channel} from '~/Models';

export interface ParsedEmoji {
	id?: string;
	name: string;
	animated?: boolean;
}

export abstract class MessageInteractionBase {
	constructor(protected gatewayService: IGatewayService) {}

	protected isOperationDisabled(guild: GuildResponse | null, operation: number): boolean {
		if (!guild) return false;
		return (guild.disabled_operations & operation) !== 0;
	}

	protected ensureTextChannel(channel: Channel): void {
		if (!TEXT_BASED_CHANNEL_TYPES.has(channel.type)) {
			throw new CannotSendMessageToNonTextChannelError();
		}
	}

	protected async dispatchEvent(params: {channel: Channel; event: GatewayDispatchEvent; data: unknown}): Promise<void> {
		const {channel, event, data} = params;

		if (channel.type === ChannelTypes.DM_PERSONAL_NOTES) {
			return this.gatewayService.dispatchPresence({
				userId: channelIdToUserId(channel.id),
				event,
				data,
			});
		}

		if (channel.guildId) {
			return this.gatewayService.dispatchGuild({guildId: channel.guildId, event, data});
		} else {
			for (const recipientId of channel.recipientIds) {
				await this.gatewayService.dispatchPresence({userId: recipientId, event, data});
			}
		}
	}
}
