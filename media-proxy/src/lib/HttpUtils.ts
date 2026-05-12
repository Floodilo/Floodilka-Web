/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Context} from 'hono';

export const parseRange = (rangeHeader: string | null, fileSize: number) => {
	if (!rangeHeader) return null;
	const matches = rangeHeader.match(/bytes=(\d*)-(\d*)/);
	if (!matches) return null;

	const start = matches[1] ? Number.parseInt(matches[1], 10) : 0;
	const end = matches[2] ? Number.parseInt(matches[2], 10) : fileSize - 1;

	return start >= fileSize || end >= fileSize || start > end ? null : {start, end};
};

export const setHeaders = (
	ctx: Context,
	size: number,
	contentType: string,
	range: {start: number; end: number} | null,
	lastModified?: Date,
) => {
	const isStreamableMedia = contentType.startsWith('video/') || contentType.startsWith('audio/');

	const headers = {
		'Accept-Ranges': 'bytes',
		'Access-Control-Allow-Origin': '*',
		'Cache-Control': isStreamableMedia
			? 'public, max-age=31536000, no-transform, immutable'
			: 'public, max-age=31536000',
		'Content-Type': contentType,
		Date: new Date().toUTCString(),
		Expires: new Date(Date.now() + 31536000000).toUTCString(),
		'Last-Modified': lastModified?.toUTCString() ?? new Date().toUTCString(),
		Vary: 'Accept-Encoding, Range',
	};

	Object.entries(headers).forEach(([k, v]) => {
		ctx.header(k, v);
	});

	if (range) {
		const length = range.end - range.start + 1;
		ctx.status(206);
		ctx.header('Content-Length', length.toString());
		ctx.header('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
	} else {
		ctx.header('Content-Length', size.toString());
	}
};
