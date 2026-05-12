/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageReactionRow} from '~/database/CassandraTypes';
import type {ChannelID, EmojiID, MessageID, UserID} from '../BrandedTypes';

export class MessageReaction {
	readonly channelId: ChannelID;
	readonly bucket: number;
	readonly messageId: MessageID;
	readonly userId: UserID;
	readonly emojiId: EmojiID;
	readonly emojiName: string;
	readonly isEmojiAnimated: boolean;

	constructor(row: MessageReactionRow) {
		this.channelId = row.channel_id;
		this.bucket = row.bucket;
		this.messageId = row.message_id;
		this.userId = row.user_id;
		this.emojiId = row.emoji_id;
		this.emojiName = row.emoji_name;
		this.isEmojiAnimated = row.emoji_animated ?? false;
	}

	toRow(): MessageReactionRow {
		return {
			channel_id: this.channelId,
			bucket: this.bucket,
			message_id: this.messageId,
			user_id: this.userId,
			emoji_id: this.emojiId,
			emoji_name: this.emojiName,
			emoji_animated: this.isEmojiAnimated,
		};
	}
}
