/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Readable} from 'node:stream';
import type {Context} from 'hono';
import {Config} from '~/Config';
import {toBodyData, toWebReadableStream} from '~/lib/BinaryUtils';
import type {HonoEnv} from '~/lib/MediaTypes';
import {headS3Object, readS3Object} from '~/lib/S3Utils';

const THEME_ID_PATTERN = /^[a-f0-9]{16}$/;

export async function handleThemeHeadRequest(ctx: Context<HonoEnv>): Promise<Response> {
	const filename = ctx.req.param('id.css');
	const themeId = filename?.replace(/\.css$/, '');

	if (!themeId || !THEME_ID_PATTERN.test(themeId)) {
		return ctx.text('Not found', {status: 404});
	}

	const {contentLength, lastModified} = await headS3Object(Config.AWS_S3_BUCKET_CDN, `themes/${themeId}.css`);

	ctx.header('Content-Type', 'text/css; charset=utf-8');
	ctx.header('Cache-Control', 'public, max-age=31536000, immutable');
	ctx.header('Access-Control-Allow-Origin', '*');
	ctx.header('Content-Length', contentLength.toString());

	if (lastModified) {
		ctx.header('Last-Modified', lastModified.toUTCString());
	}

	return ctx.body(null);
}

export async function handleThemeRequest(ctx: Context<HonoEnv>): Promise<Response> {
	const filename = ctx.req.param('id.css');
	const themeId = filename?.replace(/\.css$/, '');

	if (!themeId || !THEME_ID_PATTERN.test(themeId)) {
		return ctx.text('Not found', {status: 404});
	}

	const {data, lastModified} = await readS3Object(Config.AWS_S3_BUCKET_CDN, `themes/${themeId}.css`);

	ctx.header('Content-Type', 'text/css; charset=utf-8');
	ctx.header('Cache-Control', 'public, max-age=31536000, immutable');
	ctx.header('Access-Control-Allow-Origin', '*');

	if (lastModified) {
		ctx.header('Last-Modified', new Date(lastModified).toUTCString());
	}

	if (data instanceof Readable) {
		return ctx.body(toWebReadableStream(data));
	} else {
		ctx.header('Content-Length', data.length.toString());
		return ctx.body(toBodyData(data));
	}
}
