/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import sharp from 'sharp';
import {rgbaToThumbHash} from 'thumbhash';

export const generatePlaceholder = async (imageBuffer: Buffer): Promise<string> => {
	const {data, info} = await sharp(imageBuffer)
		.blur(10)
		.resize(100, 100, {fit: 'inside', withoutEnlargement: true})
		.ensureAlpha()
		.raw()
		.toBuffer({resolveWithObject: true});

	if (data.length !== info.width * info.height * 4) {
		throw new Error('Unexpected data length');
	}

	const placeholder = rgbaToThumbHash(info.width, info.height, data);
	return Buffer.from(placeholder).toString('base64');
};

export const processImage = async (opts: {
	buffer: Buffer;
	width: number;
	height: number;
	format: string;
	quality: string;
	animated: boolean;
}): Promise<Buffer> => {
	const metadata = await sharp(opts.buffer).metadata();

	const resizeWidth = Math.min(opts.width, metadata.width || 0);
	const resizeHeight = Math.min(opts.height, metadata.height || 0);

	return sharp(opts.buffer, {
		animated: opts.format === 'gif' || (opts.format === 'webp' && opts.animated),
	})
		.resize(resizeWidth, resizeHeight, {
			fit: 'cover',
			withoutEnlargement: true,
		})
		.toFormat(opts.format as keyof sharp.FormatEnum, {
			quality: opts.quality === 'high' ? 80 : opts.quality === 'low' ? 20 : 100,
		})
		.toBuffer();
};
