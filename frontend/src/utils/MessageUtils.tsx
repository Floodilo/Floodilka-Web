/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageRecord} from '~/records/MessageRecord';
import type {UserRecord} from '~/records/UserRecord';
import ChannelStore from '~/stores/ChannelStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import GuildStore from '~/stores/GuildStore';
import UserGuildSettingsStore from '~/stores/UserGuildSettingsStore';

export const isMentioned = (user: UserRecord, message: MessageRecord): boolean => {
	const channel = ChannelStore.getChannel(message.channelId);
	if (channel == null) {
		console.warn(`${message.channelId} does not exist!`);
		return false;
	}
	const suppressEveryone = UserGuildSettingsStore.isSuppressEveryoneEnabled(channel.guildId ?? null);
	const mentionEveryone = message.mentionEveryone && !suppressEveryone;
	if (mentionEveryone) {
		return true;
	}
	if (message.mentions.some((mention) => mention.id === user.id)) {
		return true;
	}
	if (channel.guildId == null) {
		return false;
	}
	const guild = GuildStore.getGuild(channel.guildId);
	if (!guild) {
		return false;
	}
	const guildMember = GuildMemberStore.getMember(guild.id, user.id);
	if (!guildMember) {
		return false;
	}
	return message.mentionRoles.some((roleId) => guildMember.roles.has(roleId));
};
