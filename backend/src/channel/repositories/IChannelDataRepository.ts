/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, GuildID, MessageID} from '~/BrandedTypes';
import type {ChannelRow} from '~/database/CassandraTypes';
import type {Channel} from '~/Models';

export abstract class IChannelDataRepository {
	abstract findUnique(channelId: ChannelID): Promise<Channel | null>;
	abstract upsert(data: ChannelRow): Promise<Channel>;
	abstract updateLastMessageId(channelId: ChannelID, messageId: MessageID): Promise<void>;
	abstract delete(channelId: ChannelID, guildId?: GuildID): Promise<void>;
	abstract listGuildChannels(guildId: GuildID): Promise<Array<Channel>>;
	abstract countGuildChannels(guildId: GuildID): Promise<number>;
}
