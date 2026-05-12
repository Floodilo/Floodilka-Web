/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageReference} from '~/database/CassandraTypes';
import type {ChannelID, GuildID, MessageID} from '../BrandedTypes';

export class MessageRef {
	readonly channelId: ChannelID;
	readonly messageId: MessageID;
	readonly guildId: GuildID | null;
	readonly type: number;

	constructor(ref: MessageReference) {
		this.channelId = ref.channel_id;
		this.messageId = ref.message_id;
		this.guildId = ref.guild_id ?? null;
		this.type = ref.type;
	}

	toMessageReference(): MessageReference {
		return {
			channel_id: this.channelId,
			message_id: this.messageId,
			guild_id: this.guildId,
			type: this.type,
		};
	}
}
