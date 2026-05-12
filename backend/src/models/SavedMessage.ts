/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {SavedMessageRow} from '~/database/CassandraTypes';
import type {ChannelID, MessageID, UserID} from '../BrandedTypes';

export class SavedMessage {
	readonly userId: UserID;
	readonly channelId: ChannelID;
	readonly messageId: MessageID;
	readonly savedAt: Date;

	constructor(row: SavedMessageRow) {
		this.userId = row.user_id;
		this.channelId = row.channel_id;
		this.messageId = row.message_id;
		this.savedAt = row.saved_at;
	}

	toRow(): SavedMessageRow {
		return {
			user_id: this.userId,
			channel_id: this.channelId,
			message_id: this.messageId,
			saved_at: this.savedAt,
		};
	}
}
