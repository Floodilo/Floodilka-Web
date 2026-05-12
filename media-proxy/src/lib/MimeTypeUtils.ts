/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {filetypeinfo} from 'magic-bytes.js';
import {Logger} from '~/Logger';
import {SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES, type SupportedExtension} from '~/lib/MediaTypes';

export const getMimeType = (buffer: Buffer, filename?: string): string | null => {
	if (filename) {
		const ext = filename.split('.').pop()?.toLowerCase();
		if (ext && ext in SUPPORTED_EXTENSIONS) {
			const mimeType = SUPPORTED_EXTENSIONS[ext as SupportedExtension];
			return mimeType;
		}
	}

	try {
		const fileInfo = filetypeinfo(buffer);
		if (fileInfo?.[0]?.mime && SUPPORTED_MIME_TYPES.has(fileInfo[0].mime)) {
			return fileInfo[0].mime;
		}
	} catch (error) {
		Logger.error({error}, 'Failed to detect file type using magic bytes');
	}

	return null;
};

export const generateFilename = (mimeType: string, originalFilename?: string): string => {
	const baseName = originalFilename ? originalFilename.split('.')[0] : 'file';
	const mimeToExt = Object.entries(SUPPORTED_EXTENSIONS).reduce(
		(acc, [ext, mime]) => {
			acc[mime] = ext;
			return acc;
		},
		{} as Record<string, string>,
	);

	const extension = mimeToExt[mimeType];
	if (!extension) throw new Error(`Unsupported MIME type: ${mimeType}`);
	return `${baseName}.${extension}`;
};

export const getMediaCategory = (mimeType: string): string | null => {
	const category = mimeType.split('/')[0];
	return ['image', 'video', 'audio'].includes(category) ? category : null;
};

export const getExtensionForMime = (mimeType: string): string | null => {
	for (const [ext, mime] of Object.entries(SUPPORTED_EXTENSIONS)) {
		if (mime === mimeType) return ext;
	}
	return null;
};

export const getTempFileExtension = (filename: string, mimeType: string, fallback = 'mp4'): string => {
	const fromName = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : null;
	if (fromName) return fromName;
	return getExtensionForMime(mimeType) ?? fallback;
};
