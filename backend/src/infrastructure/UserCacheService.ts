/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {UserFlags} from '~/Constants';
import {UnknownUserError} from '~/Errors';
import type {ICacheService} from '~/infrastructure/ICacheService';
import {InMemoryCoalescer} from '~/infrastructure/InMemoryCoalescer';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import type {IUserRepository} from '~/user/IUserRepository';
import type {UserPartialResponse} from '~/user/UserModel';
import {mapUserToPartialResponse} from '~/user/UserModel';

export class UserCacheService {
	private coalescer = new InMemoryCoalescer();

	constructor(
		public readonly cacheService: ICacheService,
		private userRepository: IUserRepository,
	) {}

	async getUserPartialResponse(userId: UserID, requestCache: RequestCache): Promise<UserPartialResponse> {
		const cached = requestCache.userPartials.get(userId);
		if (cached) {
			return cached;
		}

		const cacheKey = `user:partial:${userId}`;
		const redisCached = await this.cacheService.getAndRenewTtl<UserPartialResponse>(cacheKey, 300);

		if (redisCached) {
			requestCache.userPartials.set(userId, redisCached);
			return redisCached;
		}

		const userPartialResponse = await this.coalescer.coalesce(cacheKey, async () => {
			const user = await this.userRepository.findUnique(userId);
			if (!user) {
				throw new UnknownUserError();
			}
			if (user.flags & UserFlags.DELETED) {
				throw new UnknownUserError();
			}
			return mapUserToPartialResponse(user);
		});

		await this.cacheService.set(cacheKey, userPartialResponse, 300);
		requestCache.userPartials.set(userId, userPartialResponse);
		return userPartialResponse;
	}

	async invalidateUserCache(userId: UserID): Promise<void> {
		const cacheKey = `user:partial:${userId}`;
		await this.cacheService.delete(cacheKey);
	}

	async getUserPartialResponses(
		userIds: Array<UserID>,
		requestCache: RequestCache,
	): Promise<Map<UserID, UserPartialResponse>> {
		const results = new Map<UserID, UserPartialResponse>();

		const promises = userIds.map(async (userId) => {
			const userResponse = await this.getUserPartialResponse(userId, requestCache);
			results.set(userId, userResponse);
		});

		await Promise.all(promises);
		return results;
	}
}
