/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {Config} from '~/Config';
import {FloodilkaAPIError} from '~/Errors';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';

function parseTokenType(raw: string): 'user' | 'bot' | 'unknown' {
	if (raw.startsWith('flx_')) return 'user';
	const dotIndex = raw.indexOf('.');
	if (dotIndex > 0 && dotIndex < raw.length - 1) {
		const beforeDot = raw.slice(0, dotIndex);
		if (/^\d+$/.test(beforeDot)) return 'bot';
	}
	return 'unknown';
}

function extractToken(authHeader: string | null): string {
	if (!authHeader) return '';
	const lower = authHeader.toLowerCase();
	if (lower.startsWith('bot ')) return authHeader.slice(4).trim();
	if (lower.startsWith('bearer ')) return authHeader.slice(7).trim();
	return authHeader.trim();
}

export const GatewayController = (app: HonoApp) => {
	app.get('/gateway/bot', RateLimitMiddleware(RateLimitConfigs.GATEWAY_BOT_INFO), async (ctx) => {
		const token = extractToken(ctx.req.header('Authorization') || null);

		if (!token) {
			throw new FloodilkaAPIError({
				code: 'MISSING_AUTHORIZATION',
				message: 'Bot token required',
				status: 401,
			});
		}

		if (parseTokenType(token) !== 'bot') {
			throw new FloodilkaAPIError({
				code: 'INVALID_AUTH_TOKEN',
				message: 'Gateway bot endpoint only accepts bot tokens',
				status: 401,
			});
		}

		await ctx.get('botAuthService').validateBotToken(token);

		return ctx.json({
			url: Config.endpoints.gateway,
			shards: 1,
			session_start_limit: {
				total: 1000,
				remaining: 999,
				reset_after: 14400000,
				max_concurrency: 1,
			},
		});
	});
};
