/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {type CloudAttachment, CloudUpload} from '~/lib/CloudUpload';
import {Logger} from '~/lib/Logger';
import type {ApiAttachmentMetadata} from '~/utils/MessageRequestUtils';

const logger = new Logger('MessageAttachmentUtils');

export interface PreparedMessageAttachments {
	attachments?: Array<ApiAttachmentMetadata>;
	files?: Array<File>;
}

export const prepareAttachmentsForNonce = async (
	nonce: string,
	favoriteMemeId?: string,
): Promise<PreparedMessageAttachments> => {
	logger.debug(`Preparing attachments for nonce ${nonce}`);

	const messageUpload = CloudUpload.getMessageUpload(nonce);
	if (!messageUpload) {
		throw new Error('No message upload found');
	}

	const files = messageUpload.attachments.map((att) => att.file);
	const attachments = favoriteMemeId ? undefined : mapMessageUploadAttachments(messageUpload.attachments);

	return {attachments, files};
};

export const mapMessageUploadAttachments = (attachments: Array<CloudAttachment>): Array<ApiAttachmentMetadata> =>
	attachments.map((att, index) => ({
		id: String(index),
		filename: att.filename,
		title: att.filename,
		description: att.description,
		flags: att.flags,
	}));
