/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {User} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import type {UserPartialResponse} from './UserModel';
import {mapUserToPartialResponse} from './UserModel';

export async function getCachedUserPartialResponse(params: {
	userId: UserID;
	userCacheService: UserCacheService;
	requestCache: RequestCache;
}): Promise<UserPartialResponse> {
	const {userId, userCacheService, requestCache} = params;
	return await userCacheService.getUserPartialResponse(userId, requestCache);
}

export async function getCachedUserPartialResponses(params: {
	userIds: Array<UserID>;
	userCacheService: UserCacheService;
	requestCache: RequestCache;
}): Promise<Map<UserID, UserPartialResponse>> {
	const {userIds, userCacheService, requestCache} = params;
	return await userCacheService.getUserPartialResponses(userIds, requestCache);
}

export async function mapUserToPartialResponseWithCache(params: {
	user: User;
	userCacheService: UserCacheService;
	requestCache: RequestCache;
}): Promise<UserPartialResponse> {
	const {user, userCacheService, requestCache} = params;
	const cached = requestCache.userPartials.get(user.id);
	if (cached) {
		return cached;
	}
	const response = mapUserToPartialResponse(user);
	requestCache.userPartials.set(user.id, response);
	const cacheKey = `user:partial:${user.id}`;
	Promise.resolve(userCacheService.cacheService.set(cacheKey, response, 300)).catch(() => {});
	return response;
}

export async function invalidateUserCache(params: {userId: UserID; userCacheService: UserCacheService}): Promise<void> {
	const {userId, userCacheService} = params;
	await userCacheService.invalidateUserCache(userId);
}
