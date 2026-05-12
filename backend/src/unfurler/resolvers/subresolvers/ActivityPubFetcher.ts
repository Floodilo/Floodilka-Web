/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ICacheService} from '~/infrastructure/ICacheService';
import {Logger} from '~/Logger';
import * as FetchUtils from '~/utils/FetchUtils';
import type {ActivityPubPost, MastodonInstance, MastodonPost} from './ActivityPubTypes';

export class ActivityPubFetcher {
	constructor(private cacheService: ICacheService) {}

	async fetchInstanceInfo(baseUrl: string): Promise<MastodonInstance | null> {
		const cacheKey = `activitypub:instance:${baseUrl}`;
		const cached = await this.cacheService.get<MastodonInstance>(cacheKey);
		if (cached) return cached;
		try {
			const apiUrl = `${baseUrl}/api/v2/instance`;
			Logger.debug({apiUrl}, 'Fetching instance info');
			const response = await FetchUtils.sendRequest({
				url: apiUrl,
				method: 'GET',
				timeout: 5000,
				headers: {Accept: 'application/json'},
			});
			if (response.status !== 200) {
				Logger.debug({apiUrl, status: response.status}, 'Instance info request failed');
				return null;
			}
			const data = await FetchUtils.streamToString(response.stream);
			const instanceInfo = JSON.parse(data) as MastodonInstance;
			await this.cacheService.set(cacheKey, JSON.stringify(instanceInfo), 3600);
			return instanceInfo;
		} catch (error) {
			Logger.error({error, baseUrl}, 'Failed to fetch instance info');
			return null;
		}
	}

	async tryFetchActivityPubData(url: string): Promise<ActivityPubPost | null> {
		try {
			const response = await FetchUtils.sendRequest({
				url,
				method: 'GET',
				timeout: 5000,
				headers: {
					Accept: 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
				},
			});
			if (response.status !== 200) {
				Logger.debug({url, status: response.status}, 'Failed to fetch ActivityPub data');
				return null;
			}
			const data = await FetchUtils.streamToString(response.stream);
			const parsedData = JSON.parse(data);
			if (!parsedData || typeof parsedData !== 'object' || !('id' in parsedData) || !('type' in parsedData)) {
				Logger.debug({url}, 'Response is not a valid ActivityPub object');
				return null;
			}
			return parsedData as ActivityPubPost;
		} catch (error) {
			Logger.error({error, url}, 'Failed to fetch or parse ActivityPub data');
			return null;
		}
	}

	async tryFetchMastodonApi(baseUrl: string, postId: string): Promise<MastodonPost | null> {
		try {
			const apiUrl = `${baseUrl}/api/v1/statuses/${postId}`;
			Logger.debug({apiUrl}, 'Attempting to fetch from Mastodon API');
			const response = await FetchUtils.sendRequest({
				url: apiUrl,
				method: 'GET',
				timeout: 5000,
				headers: {Accept: 'application/json'},
			});
			if (response.status !== 200) {
				Logger.debug({apiUrl, status: response.status}, 'Mastodon API request failed');
				return null;
			}
			const data = await FetchUtils.streamToString(response.stream);
			return JSON.parse(data) as MastodonPost;
		} catch (error) {
			Logger.error({error, baseUrl, postId}, 'Failed to fetch or parse Mastodon API data');
			return null;
		}
	}
}
