/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AttachmentID, ChannelID, MessageID, UserID} from '~/BrandedTypes';
import type {AttachmentLookupRow, MessageRow} from '~/database/CassandraTypes';
import type {Message} from '~/Models';

export interface ListMessagesOptions {
	restrictToBeforeBucket?: boolean;
	immediateAfter?: boolean;
}

export abstract class IMessageRepository {
	abstract listMessages(
		channelId: ChannelID,
		beforeMessageId?: MessageID,
		limit?: number,
		afterMessageId?: MessageID,
		options?: ListMessagesOptions,
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
	abstract deleteAllChannelMessages(channelId: ChannelID): Promise<void>;
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
	abstract authorHasMessage(authorId: UserID, channelId: ChannelID, messageId: MessageID): Promise<boolean>;
	abstract lookupAttachmentByChannelAndFilename(
		channelId: ChannelID,
		attachmentId: AttachmentID,
		filename: string,
	): Promise<MessageID | null>;
	abstract listChannelAttachments(channelId: ChannelID): Promise<Array<AttachmentLookupRow>>;
}
