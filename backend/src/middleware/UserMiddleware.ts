/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Context} from 'hono';
import {createMiddleware} from 'hono/factory';
import type {HonoEnv} from '~/App';
import {getMetricsService} from '~/infrastructure/MetricsService';
import {Logger} from '~/Logger';
import type {User} from '~/Models';
import * as IpUtils from '~/utils/IpUtils';
import {resolveClientPlatform} from '~/utils/PlatformUtils';

type TokenType = 'session' | 'bearer' | 'bot';

interface ParsedAuthHeader {
	token: string;
	type: TokenType;
}

function parseAuthHeader(authHeader?: string | null): ParsedAuthHeader | null {
	if (!authHeader) return null;

	const normalized = authHeader.trim();
	if (!normalized) return null;

	if (normalized.startsWith('Bearer ')) {
		const token = normalized.slice('Bearer '.length);
		if (token.length === 0 || token !== token.trim()) return null;
		return {
			token,
			type: 'bearer',
		};
	}

	if (normalized.startsWith('Bot ')) {
		const token = normalized.slice('Bot '.length);
		if (token.length === 0 || token !== token.trim()) return null;
		return {
			token,
			type: 'bot',
		};
	}

	if (normalized.includes(' ')) return null;
	return {
		token: normalized,
		type: 'session',
	};
}

function setUserInContext(ctx: Context<HonoEnv>, user: User, trackActivity: boolean): void {
	ctx.set('user', user);
	if (trackActivity) {
		const now = new Date();
		const userRepository = ctx.get('userRepository');
		const redisActivityTracker = ctx.get('redisActivityTracker');
		Promise.all([
			userRepository.updateLastActiveAt({
				userId: user.id,
				lastActiveAt: now,
				lastActiveIp: IpUtils.requireClientIp(ctx.req.raw),
			}),
			redisActivityTracker.updateActivity(user.id, now),
		]).catch((err) => {
			Logger.warn({err}, 'activity tracking failed');
		});
	}
}

export const UserMiddleware = createMiddleware<HonoEnv>(async (ctx, next) => {
	const rawAuthHeader = ctx.req.header('Authorization');
	const parsed = parseAuthHeader(rawAuthHeader);

	ctx.set('oauthBearerToken', undefined);
	ctx.set('oauthBearerScopes', undefined);
	ctx.set('oauthBearerUserId', undefined);
	ctx.set('authToken', undefined);

	if (!parsed) {
		return next();
	}

	const {token, type} = parsed;
	ctx.set('authToken', token);

	if (type === 'session') {
		const authService = ctx.get('authService');
		const authSession = await authService.getAuthSessionByToken(token);
		if (authSession) {
			void authService.updateAuthSessionLastUsed(authSession.sessionIdHash);
			void authService.updateUserActivity({
				userId: authSession.userId,
				clientIp: IpUtils.requireClientIp(ctx.req.raw),
			});

			const user = await ctx.get('userService').findUniqueAssert(authSession.userId);

			const platform = resolveClientPlatform(ctx.req.raw);
			const redisActivityTracker = ctx.get('redisActivityTracker');
			void redisActivityTracker.trackDailyActiveIfNew(user.id, platform).then((isNew) => {
				if (isNew) {
					getMetricsService().counter({name: 'user.daily_active', dimensions: {platform}});
				}
			}).catch(() => {});

			ctx.set('authSession', authSession);
			ctx.set('authTokenType', 'session');
			setUserInContext(ctx, user, true);
		} else {
			getMetricsService().counter({
				name: 'auth.token.invalid',
				dimensions: {type: 'session'},
			});
		}
		await next();
		return;
	}

	if (type === 'bearer') {
		const accessToken = await ctx.get('oauth2TokenRepository').getAccessToken(token);
		const userId = accessToken?.userId ?? null;
		if (accessToken) {
			ctx.set('oauthBearerToken', token);
			ctx.set('oauthBearerScopes', accessToken.scope);
			ctx.set('oauthBearerUserId', accessToken.userId ?? undefined);
		} else {
			getMetricsService().counter({
				name: 'auth.token.invalid',
				dimensions: {type: 'bearer'},
			});
		}
		if (userId) {
			const user = await ctx.get('userService').findUnique(userId);
			if (user) {
				ctx.set('authTokenType', 'bearer');
				setUserInContext(ctx, user, false);
			}
		}
		await next();
		return;
	}

	if (type === 'bot') {
		const botAuthService = ctx.get('botAuthService');
		const botUserId = await botAuthService.validateBotToken(token);
		if (botUserId) {
			const botUser = await ctx.get('userService').findUnique(botUserId);
			if (botUser) {
				ctx.set('authTokenType', 'bot');
				setUserInContext(ctx, botUser, false);
			}
		} else {
			getMetricsService().counter({
				name: 'auth.token.invalid',
				dimensions: {type: 'bot'},
			});
		}
		await next();
		return;
	}

	await next();
});
