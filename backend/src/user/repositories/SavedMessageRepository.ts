/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {type ChannelID, createMessageID, type MessageID, type UserID} from '~/BrandedTypes';
import {deleteOneOrMany, fetchMany, prepared, upsertOne} from '~/database/Cassandra';
import type {SavedMessageRow} from '~/database/CassandraTypes';
import {SavedMessage} from '~/Models';
import {SavedMessages} from '~/Tables';
import * as SnowflakeUtils from '~/utils/SnowflakeUtils';

const createFetchSavedMessagesQuery = (limit: number) =>
	SavedMessages.selectCql({
		where: [SavedMessages.where.eq('user_id'), SavedMessages.where.lt('message_id', 'before_message_id')],
		limit,
	});

export class SavedMessageRepository {
	async listSavedMessages(
		userId: UserID,
		limit: number = 25,
		before: MessageID = createMessageID(SnowflakeUtils.getSnowflake()),
	): Promise<Array<SavedMessage>> {
		const fetchLimit = Math.max(limit * 2, 50);
		const savedMessageRows = await fetchMany<SavedMessageRow>(createFetchSavedMessagesQuery(fetchLimit), {
			user_id: userId,
			before_message_id: before,
		});
		const savedMessages: Array<SavedMessage> = [];
		for (const savedMessageRow of savedMessageRows) {
			if (savedMessages.length >= limit) break;
			savedMessages.push(new SavedMessage(savedMessageRow));
		}
		return savedMessages;
	}

	async createSavedMessage(userId: UserID, channelId: ChannelID, messageId: MessageID): Promise<SavedMessage> {
		const savedMessageRow: SavedMessageRow = {
			user_id: userId,
			channel_id: channelId,
			message_id: messageId,
			saved_at: new Date(),
		};
		await upsertOne(SavedMessages.upsertAll(savedMessageRow));
		return new SavedMessage(savedMessageRow);
	}

	async deleteSavedMessage(userId: UserID, messageId: MessageID): Promise<void> {
		await deleteOneOrMany(SavedMessages.deleteByPk({user_id: userId, message_id: messageId}));
	}

	async deleteAllSavedMessages(userId: UserID): Promise<void> {
		await deleteOneOrMany(
			prepared(SavedMessages.deleteCql({where: SavedMessages.where.eq('user_id')}), {user_id: userId}),
		);
	}
}
