/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MAX_ATTACHMENTS_PER_MESSAGE} from '~/Constants';
import {CloudUpload} from '~/lib/CloudUpload';

interface FileUploadResult {
	success: boolean;
	error?: 'too_many_attachments' | 'no_files';
}

export async function handleFileUpload(
	channelId: string,
	files: FileList | Array<File>,
	currentAttachmentCount: number,
): Promise<FileUploadResult> {
	const fileArray = Array.from(files);

	if (fileArray.length === 0) {
		return {success: false, error: 'no_files'};
	}

	if (currentAttachmentCount + fileArray.length > MAX_ATTACHMENTS_PER_MESSAGE) {
		return {success: false, error: 'too_many_attachments'};
	}

	await CloudUpload.addFiles(channelId, fileArray);
	return {success: true};
}
