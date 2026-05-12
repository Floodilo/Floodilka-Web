/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import assert from 'node:assert/strict';
import type {Context} from 'hono';
import {HTTPException} from 'hono/http-exception';
import {Config} from '~/Config';
import {toBodyData} from '~/lib/BinaryUtils';
import {setHeaders} from '~/lib/HttpUtils';
import type {HonoEnv} from '~/lib/MediaTypes';
import {readS3Object} from '~/lib/S3Utils';

export const handleStaticProxyRequest = async (ctx: Context<HonoEnv>): Promise<Response> => {
	const bucket = Config.AWS_S3_BUCKET_STATIC;
	const path = ctx.req.path;
	if (!bucket || path === '/') {
		return ctx.text('Not Found', 404);
	}
	const key = path.replace(/^\/+/, '');
	try {
		const {data, size, contentType, lastModified} = await readS3Object(bucket, key);
		assert(Buffer.isBuffer(data));
		setHeaders(ctx, size, contentType, null, lastModified);
		return ctx.body(toBodyData(data));
	} catch (error) {
		if (error instanceof HTTPException) {
			throw error;
		}
		return ctx.text('Not Found', 404);
	}
};
