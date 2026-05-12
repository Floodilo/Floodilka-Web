/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {timingSafeEqual} from 'node:crypto';
import {createMiddleware} from 'hono/factory';
import {HTTPException} from 'hono/http-exception';
import {Config} from '~/Config';
import type {HonoEnv} from '~/lib/MediaTypes';

export const InternalNetworkRequired = createMiddleware<HonoEnv>(async (ctx, next) => {
	const authHeader = ctx.req.header('Authorization');
	const expectedAuth = `Bearer ${Config.SECRET_KEY}`;
	if (!authHeader) {
		throw new HTTPException(401, {message: 'Unauthorized'});
	}
	const authBuffer = Buffer.from(authHeader, 'utf8');
	const expectedBuffer = Buffer.from(expectedAuth, 'utf8');
	if (authBuffer.length !== expectedBuffer.length || !timingSafeEqual(authBuffer, expectedBuffer)) {
		throw new HTTPException(401, {message: 'Unauthorized'});
	}
	await next();
});
