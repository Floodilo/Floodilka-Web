/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import {HTTPException} from 'hono/http-exception';
import type {HonoEnv} from '~/App';
import {Logger} from '~/Logger';

interface RequireXForwardedForOptions {
	exemptPaths?: Array<string>;
}

const defaultExemptPaths: Array<string> = ['/_health', '/_ready', '/_rpc', '/webhooks/livekit', '/test'];

export const RequireXForwardedForMiddleware = ({exemptPaths = defaultExemptPaths}: RequireXForwardedForOptions = {}) =>
	createMiddleware<HonoEnv>(async (ctx, next) => {
		const path = ctx.req.path;
		if (exemptPaths.some((prefix) => path === prefix || path.startsWith(prefix))) {
			await next();
			return;
		}

		const headerValue = ctx.req.header('x-forwarded-for');
		if (!headerValue || headerValue.trim() === '') {
			Logger.warn({path}, 'Rejected request without X-Forwarded-For header');
			throw new HTTPException(403, {message: 'Forbidden'});
		}

		await next();
	});
