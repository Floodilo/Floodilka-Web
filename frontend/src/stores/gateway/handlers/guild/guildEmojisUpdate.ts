/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildEmoji} from '~/records/GuildEmojiRecord';
import EmojiStore from '~/stores/EmojiStore';
import type {GatewayHandlerContext} from '../index';

interface GuildEmojisUpdatePayload {
	guild_id: string;
	emojis: ReadonlyArray<GuildEmoji>;
}

export function handleGuildEmojisUpdate(data: GuildEmojisUpdatePayload, _context: GatewayHandlerContext): void {
	EmojiStore.handleGuildEmojiUpdated({guildId: data.guild_id, emojis: data.emojis});
}
