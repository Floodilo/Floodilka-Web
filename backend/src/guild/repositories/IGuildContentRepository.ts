/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {EmojiID, GuildID, StickerID} from '~/BrandedTypes';
import type {GuildEmojiRow, GuildStickerRow} from '~/database/CassandraTypes';
import type {GuildEmoji, GuildSticker} from '~/Models';

export abstract class IGuildContentRepository {
	abstract getEmoji(emojiId: EmojiID, guildId: GuildID): Promise<GuildEmoji | null>;
	abstract getEmojiById(emojiId: EmojiID): Promise<GuildEmoji | null>;
	abstract listEmojis(guildId: GuildID): Promise<Array<GuildEmoji>>;
	abstract countEmojis(guildId: GuildID): Promise<number>;
	abstract upsertEmoji(data: GuildEmojiRow): Promise<GuildEmoji>;
	abstract deleteEmoji(guildId: GuildID, emojiId: EmojiID): Promise<void>;
	abstract getSticker(stickerId: StickerID, guildId: GuildID): Promise<GuildSticker | null>;
	abstract getStickerById(stickerId: StickerID): Promise<GuildSticker | null>;
	abstract listStickers(guildId: GuildID): Promise<Array<GuildSticker>>;
	abstract countStickers(guildId: GuildID): Promise<number>;
	abstract upsertSticker(data: GuildStickerRow): Promise<GuildSticker>;
	abstract deleteSticker(guildId: GuildID, stickerId: StickerID): Promise<void>;
}
