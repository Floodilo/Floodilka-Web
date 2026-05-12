/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import * as LocaleUtils from '~/utils/LocaleUtils';

const logger = new Logger('Klipy');

const getLocale = (): string => LocaleUtils.getCurrentLocale();

export interface KlipyGif {
	id: string;
	title: string;
	url: string;
	src: string;
	proxy_src: string;
	width: number;
	height: number;
}

interface KlipyCategory {
	name: string;
	src: string;
	proxy_src: string;
}

export interface KlipyFeatured {
	categories: Array<KlipyCategory>;
	gifs: Array<KlipyGif>;
}

let klipyFeaturedCache: KlipyFeatured | null = null;

export const search = async (q: string): Promise<Array<KlipyGif>> => {
	try {
		logger.debug(`Searching for GIFs with query: "${q}"`);
		const response = await http.get<Array<KlipyGif>>({
			url: Endpoints.KLIPY_SEARCH,
			query: {q, locale: getLocale()},
		});
		const gifs = response.body;
		logger.debug(`Found ${gifs.length} GIFs for query "${q}"`);
		return gifs;
	} catch (error) {
		logger.error(`Failed to search for GIFs with query "${q}":`, error);
		throw error;
	}
};

export const getFeatured = async (): Promise<KlipyFeatured> => {
	if (klipyFeaturedCache) {
		logger.debug('Returning cached featured Klipy content');
		return klipyFeaturedCache;
	}

	try {
		logger.debug('Fetching featured Klipy content');
		const response = await http.get<KlipyFeatured>({
			url: Endpoints.KLIPY_FEATURED,
			query: {locale: getLocale()},
		});
		const featured = response.body;
		klipyFeaturedCache = featured;
		logger.debug(
			`Fetched featured Klipy content: ${featured.categories.length} categories and ${featured.gifs.length} GIFs`,
		);
		return featured;
	} catch (error) {
		logger.error('Failed to fetch featured Klipy content:', error);
		throw error;
	}
};

export const getTrending = async (): Promise<Array<KlipyGif>> => {
	try {
		logger.debug('Fetching trending Klipy GIFs');
		const response = await http.get<Array<KlipyGif>>({
			url: Endpoints.KLIPY_TRENDING_GIFS,
			query: {locale: getLocale()},
		});
		const gifs = response.body;
		logger.debug(`Fetched ${gifs.length} trending Klipy GIFs`);
		return gifs;
	} catch (error) {
		logger.error('Failed to fetch trending Klipy GIFs:', error);
		throw error;
	}
};

export const registerShare = async (id: string, q: string): Promise<void> => {
	try {
		logger.debug(`Registering GIF share: id=${id}, query="${q}"`);
		await http.post({url: Endpoints.KLIPY_REGISTER_SHARE, body: {id, q, locale: getLocale()}});
		logger.debug(`Successfully registered GIF share for id=${id}`);
	} catch (error) {
		logger.error(`Failed to register GIF share for id=${id}:`, error);
	}
};

export const suggest = async (q: string): Promise<Array<string>> => {
	try {
		logger.debug(`Getting Klipy search suggestions for: "${q}"`);
		const response = await http.get<Array<string>>({
			url: Endpoints.KLIPY_SUGGEST,
			query: {q, locale: getLocale()},
		});
		const suggestions = response.body;
		logger.debug(`Received ${suggestions.length} suggestions for query "${q}"`);
		return suggestions;
	} catch (error) {
		logger.error(`Failed to get suggestions for query "${q}":`, error);
		throw error;
	}
};
