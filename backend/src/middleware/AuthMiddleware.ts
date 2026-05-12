/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {AccessDeniedError, AccountSuspiciousActivityError, UnauthorizedError} from '~/Errors';

export const LoginRequired = createMiddleware<HonoEnv>(async (ctx, next) => {
	const user = ctx.get('user');
	if (!user) {
		throw new UnauthorizedError();
	}
	if (user.suspiciousActivityFlags !== null && user.suspiciousActivityFlags !== 0) {
		throw new AccountSuspiciousActivityError(user.suspiciousActivityFlags);
	}

	await next();
});

export const LoginRequiredAllowSuspicious = createMiddleware<HonoEnv>(async (ctx, next) => {
	const user = ctx.get('user');
	if (!user) {
		throw new UnauthorizedError();
	}
	await next();
});

export const DefaultUserOnly = createMiddleware<HonoEnv>(async (ctx, next) => {
	const user = ctx.get('user');
	if (!user) {
		throw new UnauthorizedError();
	}
	if (user.isBot) {
		throw new AccessDeniedError();
	}
	await next();
});
