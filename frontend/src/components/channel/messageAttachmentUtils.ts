/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageAttachment} from '~/records/MessageRecord';

export const isImageType = (contentType?: string): boolean => contentType?.startsWith('image/') ?? false;

export const isVideoType = (contentType?: string): boolean => contentType?.startsWith('video/') ?? false;

export const isAudioType = (contentType?: string): boolean => contentType?.startsWith('audio/') ?? false;

export const isGifType = (contentType?: string): boolean => contentType === 'image/gif';

const hasDimensions = (attachment: MessageAttachment): boolean =>
	typeof attachment.width === 'number' && typeof attachment.height === 'number';

export const isMediaAttachment = (attachment: MessageAttachment): boolean =>
	hasDimensions(attachment) &&
	(isImageType(attachment.content_type) ||
		isVideoType(attachment.content_type) ||
		isAudioType(attachment.content_type));

export function splitMediaAndFileAttachments(attachments: ReadonlyArray<MessageAttachment>): {
	mediaAttachments: Array<MessageAttachment>;
	fileAttachments: Array<MessageAttachment>;
} {
	const mediaAttachments: Array<MessageAttachment> = [];
	const fileAttachments: Array<MessageAttachment> = [];

	for (const attachment of attachments) {
		if (isMediaAttachment(attachment)) {
			mediaAttachments.push(attachment);
		} else {
			fileAttachments.push(attachment);
		}
	}

	return {mediaAttachments, fileAttachments};
}
