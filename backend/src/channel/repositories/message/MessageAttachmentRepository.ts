/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AttachmentID, ChannelID, MessageID} from '~/BrandedTypes';
import {fetchMany, fetchOne} from '~/database/Cassandra';
import type {AttachmentLookupRow} from '~/database/CassandraTypes';
import {AttachmentLookup} from '~/Tables';

const LOOKUP_ATTACHMENT_BY_CHANNEL_AND_FILENAME_QUERY = AttachmentLookup.selectCql({
	where: [
		AttachmentLookup.where.eq('channel_id'),
		AttachmentLookup.where.eq('attachment_id'),
		AttachmentLookup.where.eq('filename'),
	],
	limit: 1,
});

const LIST_CHANNEL_ATTACHMENTS_QUERY = AttachmentLookup.selectCql({
	where: AttachmentLookup.where.eq('channel_id'),
});

export class MessageAttachmentRepository {
	async lookupAttachmentByChannelAndFilename(
		channelId: ChannelID,
		attachmentId: AttachmentID,
		filename: string,
	): Promise<MessageID | null> {
		const result = await fetchOne<AttachmentLookupRow>(LOOKUP_ATTACHMENT_BY_CHANNEL_AND_FILENAME_QUERY, {
			channel_id: channelId,
			attachment_id: attachmentId,
			filename,
		});
		return result ? result.message_id : null;
	}

	async listChannelAttachments(channelId: ChannelID): Promise<Array<AttachmentLookupRow>> {
		const results = await fetchMany<AttachmentLookupRow>(LIST_CHANNEL_ATTACHMENTS_QUERY, {
			channel_id: channelId,
		});
		return results;
	}
}
