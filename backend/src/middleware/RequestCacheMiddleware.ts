/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import type {UserPartialResponse} from '~/user/UserModel';

export interface RequestCache {
	userPartials: Map<bigint, UserPartialResponse>;
	clear(): void;
}

class RequestCacheImpl implements RequestCache {
	userPartials = new Map<bigint, UserPartialResponse>();

	clear(): void {
		this.userPartials.clear();
	}
}

export const RequestCacheMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	const requestCache: RequestCache = new RequestCacheImpl();
	ctx.set('requestCache', requestCache);
	try {
		await next();
	} finally {
		requestCache.clear();
	}
});

export function createRequestCache(): RequestCache {
	return new RequestCacheImpl();
}
