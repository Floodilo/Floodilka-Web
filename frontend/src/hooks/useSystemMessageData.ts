/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import type {MessageRecord} from '~/records/MessageRecord';
import type {UserRecord} from '~/records/UserRecord';
import ChannelStore from '~/stores/ChannelStore';
import GuildStore from '~/stores/GuildStore';
import UserStore from '~/stores/UserStore';

interface SystemMessageData {
	author: UserRecord;
	channel: ChannelRecord | null;
	guild: GuildRecord | undefined;
}

export function useSystemMessageData(message: MessageRecord): SystemMessageData {
	const authorFromStore = UserStore.getUser(message.author.id);
	const author = authorFromStore ?? message.author;
	const channel = ChannelStore.getChannel(message.channelId);
	const guild = GuildStore.getGuild(channel?.guildId ?? '');

	return {
		author,
		channel: channel ?? null,
		guild,
	};
}
