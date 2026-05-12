/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Context} from 'hono';
import type {KlipyCategoryTagResponse, KlipyGifResponse} from '~/klipy/KlipyModel';

export interface IKlipyService {
	search(params: {q: string; locale: string; ctx: Context}): Promise<Array<KlipyGifResponse>>;

	registerShare(params: {id: string; q: string; locale: string; ctx: Context}): Promise<void>;

	getFeatured(params: {locale: string; ctx: Context}): Promise<{
		gifs: Array<KlipyGifResponse>;
		categories: Array<KlipyCategoryTagResponse>;
	}>;

	getTrendingGifs(params: {locale: string; ctx: Context}): Promise<Array<KlipyGifResponse>>;

	suggest(params: {q: string; locale: string; ctx: Context}): Promise<Array<string>>;
}
