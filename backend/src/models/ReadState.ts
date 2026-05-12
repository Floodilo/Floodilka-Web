/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ReadStateRow} from '~/database/CassandraTypes';
import type {ChannelID, MessageID, UserID} from '../BrandedTypes';

export class ReadState {
	readonly userId: UserID;
	readonly channelId: ChannelID;
	readonly lastMessageId: MessageID | null;
	readonly mentionCount: number;
	readonly lastPinTimestamp: Date | null;

	constructor(row: ReadStateRow) {
		this.userId = row.user_id;
		this.channelId = row.channel_id;
		this.lastMessageId = row.message_id ?? null;
		this.mentionCount = row.mention_count ?? 0;
		this.lastPinTimestamp = row.last_pin_timestamp ?? null;
	}

	toRow(): ReadStateRow {
		return {
			user_id: this.userId,
			channel_id: this.channelId,
			message_id: this.lastMessageId,
			mention_count: this.mentionCount,
			last_pin_timestamp: this.lastPinTimestamp,
		};
	}
}
