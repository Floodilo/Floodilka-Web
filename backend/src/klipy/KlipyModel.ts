/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {z} from '~/Schema';

export const KlipyGifResponse = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string(),
	src: z.string(),
	proxy_src: z.string(),
	width: z.number().int(),
	height: z.number().int(),
});

export type KlipyGifResponse = z.infer<typeof KlipyGifResponse>;

export const KlipyCategoryTagResponse = z.object({
	name: z.string(),
	src: z.string(),
	proxy_src: z.string(),
});

export type KlipyCategoryTagResponse = z.infer<typeof KlipyCategoryTagResponse>;
