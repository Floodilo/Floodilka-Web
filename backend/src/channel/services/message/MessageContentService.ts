/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID, WebhookID} from '~/BrandedTypes';
import {ChannelTypes, GuildExplicitContentFilterTypes} from '~/Constants';
import type {GuildMemberResponse, GuildResponse} from '~/guild/GuildModel';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {Channel} from '~/Models';
import type {PackService} from '~/pack/PackService';
import type {IUserRepository} from '~/user/IUserRepository';
import * as EmojiUtils from '~/utils/EmojiUtils';

export class MessageContentService {
	constructor(
		private userRepository: IUserRepository,
		private guildRepository: IGuildRepository,
		private packService: PackService,
	) {}

	async sanitizeCustomEmojis(params: {
		content: string;
		userId: UserID | null;
		webhookId: WebhookID | null;
		guildId: GuildID | null;
		hasPermission?: (permission: bigint) => Promise<boolean>;
	}): Promise<string> {
		const packResolver = await this.packService.createPackExpressionAccessResolver({
			userId: params.userId,
			type: 'emoji',
		});

		return await EmojiUtils.sanitizeCustomEmojis({
			...params,
			userRepository: this.userRepository,
			guildRepository: this.guildRepository,
			packResolver,
		});
	}

	isNSFWContentAllowed(params: {
		channel?: Channel;
		guild?: GuildResponse | null;
		member?: GuildMemberResponse | null;
	}): boolean {
		const {channel, guild, member} = params;

		if (channel?.type === ChannelTypes.GUILD_TEXT && channel.isNsfw) {
			return true;
		}

		if (!guild) {
			return false;
		}

		const explicitContentFilter = guild.explicit_content_filter;

		if (explicitContentFilter === GuildExplicitContentFilterTypes.DISABLED) {
			return true;
		}

		if (explicitContentFilter === GuildExplicitContentFilterTypes.MEMBERS_WITHOUT_ROLES) {
			const hasRoles = member && member.roles.length > 0;
			return !!hasRoles;
		}

		return false;
	}
}
