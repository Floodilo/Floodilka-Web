/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as v from 'valibot';

export const ImageParamSchema = v.object({
	id: v.string(),
	filename: v.pipe(
		v.string(),
		v.minLength(1),
		v.maxLength(100),
		v.regex(/^[a-zA-Z0-9_]+\.[a-zA-Z0-9]+$/, 'Invalid filename'),
	),
});

export const ImageQuerySchema = v.object({
	size: v.optional(
		v.picklist([
			'16',
			'20',
			'22',
			'24',
			'28',
			'32',
			'40',
			'44',
			'48',
			'56',
			'60',
			'64',
			'80',
			'96',
			'100',
			'128',
			'160',
			'240',
			'256',
			'300',
			'320',
			'480',
			'512',
			'600',
			'640',
			'1024',
			'1280',
			'1536',
			'2048',
			'3072',
			'4096',
		]),
		'128',
	),
	quality: v.optional(v.picklist(['high', 'low', 'lossless']), 'high'),
	animated: v.pipe(
		v.optional(v.picklist(['true', 'false']), 'false'),
		v.transform((v) => v === 'true'),
	),
});

export const ExternalQuerySchema = v.object({
	width: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1), v.maxValue(4096))),
	height: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1), v.maxValue(4096))),
	format: v.optional(v.picklist(['png', 'jpg', 'jpeg', 'webp', 'gif'])),
	quality: v.optional(v.picklist(['high', 'low', 'lossless']), 'lossless'),
	animated: v.pipe(
		v.optional(v.picklist(['true', 'false']), 'false'),
		v.transform((v) => v === 'true'),
	),
});
