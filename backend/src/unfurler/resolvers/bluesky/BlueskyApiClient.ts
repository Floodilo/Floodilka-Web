/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ICacheService} from '~/infrastructure/ICacheService';
import {Logger} from '~/Logger';
import * as FetchUtils from '~/utils/FetchUtils';
import type {BlueskyPostThread, BlueskyProfile, HandleResolution} from './BlueskyTypes';

export class BlueskyApiClient {
	private static readonly API_BASE = 'https://api.bsky.app/xrpc';

	constructor(private cacheService: ICacheService) {}

	async resolveDid(handle: string): Promise<string | null> {
		Logger.debug({handle}, 'Resolving handle to DID');
		if (handle.startsWith('did:')) {
			Logger.debug({handle}, 'Handle is already a DID');
			return handle;
		}

		try {
			const response = await FetchUtils.sendRequest({
				url: `${BlueskyApiClient.API_BASE}/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
				method: 'GET',
			});

			if (response.status !== 200) {
				Logger.debug({handle, status: response.status}, 'Failed to resolve handle to DID');
				return null;
			}

			const responseText = await FetchUtils.streamToString(response.stream);
			const resolution = JSON.parse(responseText) as HandleResolution;
			Logger.debug({handle, did: resolution.did}, 'Successfully resolved handle to DID');
			return resolution.did;
		} catch (error) {
			Logger.error({error, handle}, 'Failed to resolve handle to DID');
			return null;
		}
	}

	async getServiceEndpoint(did: string): Promise<string> {
		const cacheKey = `bluesky:service-endpoint:${did}`;
		const cached = await this.cacheService.get<string>(cacheKey);
		if (cached) return cached;

		try {
			let url: string;
			if (did.startsWith('did:web:')) {
				url = `https://${did.split(':')[2]}/.well-known/did.json`;
			} else {
				url = `https://plc.directory/${did}`;
			}

			const response = await FetchUtils.sendRequest({url, method: 'GET'});
			if (response.status !== 200) {
				Logger.debug({did, status: response.status}, 'Failed to fetch service endpoint');
				return 'https://bsky.social';
			}

			const responseText = await FetchUtils.streamToString(response.stream);
			const didDoc = JSON.parse(responseText);
			let serviceEndpoint = 'https://bsky.social';

			for (const service of didDoc.service || []) {
				if (service.type === 'AtprotoPersonalDataServer') {
					serviceEndpoint = service.serviceEndpoint;
					break;
				}
			}

			await this.cacheService.set(cacheKey, serviceEndpoint, 3600);
			Logger.debug({did, serviceEndpoint}, 'Retrieved and cached service endpoint');
			return serviceEndpoint;
		} catch (error) {
			Logger.error({error, did}, 'Failed to fetch service endpoint');
			return 'https://bsky.social';
		}
	}

	async fetchPost(atUri: string): Promise<BlueskyPostThread | null> {
		Logger.debug({atUri}, 'Fetching post');
		try {
			const response = await FetchUtils.sendRequest({
				url: `${BlueskyApiClient.API_BASE}/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=0`,
				method: 'GET',
			});

			if (response.status !== 200) {
				Logger.debug({atUri, status: response.status}, 'Failed to fetch post');
				return null;
			}

			const responseText = await FetchUtils.streamToString(response.stream);
			const thread = JSON.parse(responseText) as BlueskyPostThread;
			Logger.debug(
				{
					atUri,
					author: thread.thread.post.author.handle,
					hasEmbed: !!thread.thread.post.embed,
					isReply: !!thread.thread.post.record.reply,
					hasParent: !!thread.thread.parent,
				},
				'Post fetched and parsed successfully',
			);
			return thread;
		} catch (error) {
			Logger.error({error, atUri}, 'Failed to fetch post');
			return null;
		}
	}

	async fetchProfile(handle: string): Promise<BlueskyProfile | null> {
		Logger.debug({handle}, 'Fetching profile');
		try {
			const response = await FetchUtils.sendRequest({
				url: `${BlueskyApiClient.API_BASE}/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
				method: 'GET',
			});

			if (response.status !== 200) {
				Logger.debug({handle, status: response.status}, 'Failed to fetch profile');
				return null;
			}

			const responseText = await FetchUtils.streamToString(response.stream);
			const profile = JSON.parse(responseText) as BlueskyProfile;
			Logger.debug(
				{handle, did: profile.did, hasAvatar: !!profile.avatar, hasBanner: !!profile.banner},
				'Profile fetched and parsed successfully',
			);
			return profile;
		} catch (error) {
			Logger.error({error, handle}, 'Failed to fetch profile');
			return null;
		}
	}
}
