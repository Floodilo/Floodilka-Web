/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, MessageID, UserID} from '~/BrandedTypes';
import type {ReadState} from '~/Models';

export abstract class IReadStateRepository {
	abstract listReadStates(userId: UserID): Promise<Array<ReadState>>;
	abstract upsertReadState(
		userId: UserID,
		channelId: ChannelID,
		messageId: MessageID,
		mentionCount?: number,
		lastPinTimestamp?: Date,
	): Promise<ReadState>;
	abstract incrementReadStateMentions(
		userId: UserID,
		channelId: ChannelID,
		incrementBy?: number,
	): Promise<ReadState | null>;
	abstract bulkIncrementMentionCounts(updates: Array<{userId: UserID; channelId: ChannelID}>): Promise<void>;
	abstract deleteReadState(userId: UserID, channelId: ChannelID): Promise<void>;
	abstract bulkAckMessages(
		userId: UserID,
		readStates: Array<{channelId: ChannelID; messageId: MessageID}>,
	): Promise<Array<ReadState>>;
	abstract upsertPinAck(userId: UserID, channelId: ChannelID, lastPinTimestamp: Date): Promise<void>;
}
