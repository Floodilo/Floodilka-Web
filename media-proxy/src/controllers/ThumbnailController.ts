/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import type {Context} from 'hono';
import {HTTPException} from 'hono/http-exception';
import sharp from 'sharp';
import {temporaryFile} from 'tempy';
import * as v from 'valibot';
import {Config} from '~/Config';
import {Logger} from '~/Logger';
import {toBodyData} from '~/lib/BinaryUtils';
import {createThumbnail} from '~/lib/FFmpegUtils';
import type {HonoEnv} from '~/lib/MediaTypes';
import {getMediaCategory, getMimeType, getTempFileExtension} from '~/lib/MimeTypeUtils';
import {readS3Object} from '~/lib/S3Utils';

const ThumbnailRequestSchema = v.object({
	type: v.literal('upload'),
	upload_filename: v.string(),
});

export const handleThumbnailRequest = async (ctx: Context<HonoEnv>): Promise<Response> => {
	try {
		const body = await ctx.req.json();
		const {upload_filename} = v.parse(ThumbnailRequestSchema, body);

		const {data} = await readS3Object(Config.AWS_S3_BUCKET_UPLOADS, upload_filename);

		assert(data instanceof Buffer);

		const mimeType = getMimeType(data, upload_filename);
		if (!mimeType) {
			throw new HTTPException(400, {message: 'Unable to determine file type'});
		}

		const mediaType = getMediaCategory(mimeType);
		if (mediaType !== 'video') {
			throw new HTTPException(400, {message: 'Not a video file'});
		}

		const ext = getTempFileExtension(upload_filename, mimeType);
		const tempVideoPath = temporaryFile({extension: ext});
		ctx.get('tempFiles').push(tempVideoPath);
		await fs.writeFile(tempVideoPath, data);

		const thumbnailPath = await createThumbnail(tempVideoPath);
		ctx.get('tempFiles').push(thumbnailPath);

		const thumbnailData = await fs.readFile(thumbnailPath);
		const processedThumbnail = await sharp(thumbnailData).jpeg({quality: 80}).toBuffer();

		return ctx.body(toBodyData(processedThumbnail), {
			headers: {
				'Content-Type': 'image/jpeg',
			},
		});
	} catch (error) {
		Logger.error({error}, 'Failed to generate thumbnail');
		throw new HTTPException(404);
	}
};
