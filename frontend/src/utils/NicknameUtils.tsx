/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserRecord} from '~/records/UserRecord';
import ChannelStore from '~/stores/ChannelStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import RelationshipStore from '~/stores/RelationshipStore';
import SelectedGuildStore from '~/stores/SelectedGuildStore';

export const getNickname = (user: UserRecord, guildId?: string | null, channelId?: string | null) => {
	let name = user.displayName;

	const relationship = RelationshipStore.getRelationship(user.id);
	if (relationship?.nickname) {
		name = relationship.nickname;
	}

	guildId ??= SelectedGuildStore.selectedGuildId;
	if (guildId) {
		const member = GuildMemberStore.getMember(guildId, user.id);
		if (member?.nick) {
			name = member.nick;
		}
	} else if (channelId) {
		const channel = ChannelStore.getChannel(channelId);
		if (channel?.nicks?.[user.id]) {
			name = channel.nicks[user.id];
		}
	}

	return name;
};
