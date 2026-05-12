/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AttachmentID, ChannelID, EmojiID, GuildID, MessageID, UserID} from '~/BrandedTypes';
import type {AttachmentLookupRow, ChannelRow, MessageRow} from '~/database/CassandraTypes';
import type {Channel, Message, MessageReaction} from '~/Models';
import {IChannelRepositoryAggregate} from './repositories/IChannelRepositoryAggregate';

export abstract class IChannelRepository extends IChannelRepositoryAggregate {
	abstract findUnique(channelId: ChannelID): Promise<Channel | null>;
	abstract upsert(data: ChannelRow): Promise<Channel>;
	abstract updateLastMessageId(channelId: ChannelID, messageId: MessageID): Promise<void>;
	abstract delete(channelId: ChannelID, guildId?: GuildID): Promise<void>;
	abstract listGuildChannels(guildId: GuildID): Promise<Array<Channel>>;
	abstract countGuildChannels(guildId: GuildID): Promise<number>;

	abstract listMessages(
		channelId: ChannelID,
		beforeMessageId?: MessageID,
		limit?: number,
		afterMessageId?: MessageID,
	): Promise<Array<Message>>;
	abstract getMessage(channelId: ChannelID, messageId: MessageID): Promise<Message | null>;
	abstract upsertMessage(data: MessageRow, oldData?: MessageRow | null): Promise<Message>;
	abstract deleteMessage(
		channelId: ChannelID,
		messageId: MessageID,
		authorId: UserID,
		pinnedTimestamp?: Date,
	): Promise<void>;
	abstract bulkDeleteMessages(channelId: ChannelID, messageIds: Array<MessageID>): Promise<void>;

	abstract listChannelPins(channelId: ChannelID, beforePinnedTimestamp: Date, limit?: number): Promise<Array<Message>>;

	abstract listMessageReactions(channelId: ChannelID, messageId: MessageID): Promise<Array<MessageReaction>>;
	abstract listReactionUsers(
		channelId: ChannelID,
		messageId: MessageID,
		emojiName: string,
		limit?: number,
		after?: UserID,
		emojiId?: EmojiID,
	): Promise<Array<MessageReaction>>;
	abstract addReaction(
		channelId: ChannelID,
		messageId: MessageID,
		userId: UserID,
		emojiName: string,
		emojiId?: EmojiID,
		emojiAnimated?: boolean,
	): Promise<MessageReaction>;
	abstract removeReaction(
		channelId: ChannelID,
		messageId: MessageID,
		userId: UserID,
		emojiName: string,
		emojiId?: EmojiID,
	): Promise<void>;
	abstract removeAllReactions(channelId: ChannelID, messageId: MessageID): Promise<void>;
	abstract removeAllReactionsForEmoji(
		channelId: ChannelID,
		messageId: MessageID,
		emojiName: string,
		emojiId?: EmojiID,
	): Promise<void>;
	abstract countReactionUsers(
		channelId: ChannelID,
		messageId: MessageID,
		emojiName: string,
		emojiId?: EmojiID,
	): Promise<number>;
	abstract countUniqueReactions(channelId: ChannelID, messageId: MessageID): Promise<number>;
	abstract checkUserReactionExists(
		channelId: ChannelID,
		messageId: MessageID,
		userId: UserID,
		emojiName: string,
		emojiId?: EmojiID,
	): Promise<boolean>;
	abstract lookupAttachmentByChannelAndFilename(
		channelId: ChannelID,
		attachmentId: AttachmentID,
		filename: string,
	): Promise<MessageID | null>;
	abstract listChannelAttachments(channelId: ChannelID): Promise<Array<AttachmentLookupRow>>;
	abstract listMessagesByAuthor(
		authorId: UserID,
		limit?: number,
		lastChannelId?: ChannelID,
		lastMessageId?: MessageID,
	): Promise<Array<{channelId: ChannelID; messageId: MessageID}>>;
	abstract deleteMessagesByAuthor(
		authorId: UserID,
		channelIds?: Array<ChannelID>,
		messageIds?: Array<MessageID>,
	): Promise<void>;
	abstract anonymizeMessage(channelId: ChannelID, messageId: MessageID, newAuthorId: UserID): Promise<void>;
	abstract deleteAllChannelMessages(channelId: ChannelID): Promise<void>;
}
