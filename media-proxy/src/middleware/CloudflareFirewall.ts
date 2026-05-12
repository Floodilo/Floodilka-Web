/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import {HTTPException} from 'hono/http-exception';
import {Logger} from '~/Logger';
import type {CloudflareIPService} from '~/lib/CloudflareIPService';
import type {HonoEnv} from '~/lib/MediaTypes';

interface CloudflareFirewallOptions {
	enabled: boolean;
	exemptPaths?: Array<string>;
}

export const createCloudflareFirewall = (
	ipService: CloudflareIPService,
	{enabled, exemptPaths = ['/_health', '/_metadata']}: CloudflareFirewallOptions,
) =>
	createMiddleware<HonoEnv>(async (ctx, next) => {
		if (!enabled) {
			await next();
			return;
		}

		const path = ctx.req.path;
		if (exemptPaths.some((prefix) => path === prefix || path.startsWith(prefix))) {
			await next();
			return;
		}

		const xff = ctx.req.header('x-forwarded-for');
		if (!xff) {
			Logger.warn({path}, 'Rejected request without X-Forwarded-For header');
			throw new HTTPException(403, {message: 'Forbidden'});
		}
		const connectingIP = xff.split(',')[0]?.trim();
		if (!connectingIP || !ipService.isFromCloudflare(connectingIP)) {
			Logger.warn({connectingIP, path}, 'Rejected request from non-Cloudflare IP');
			throw new HTTPException(403, {message: 'Forbidden'});
		}

		await next();
	});
