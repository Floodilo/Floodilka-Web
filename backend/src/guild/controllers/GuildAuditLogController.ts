/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createGuildID, createUserID} from '~/BrandedTypes';
import {AuditLogActionType} from '~/constants/AuditLogActionType';
import {InputValidationError} from '~/Errors';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {coerceNumberFromString, Int32Type, Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';

const actionTypeSchema = coerceNumberFromString(Int32Type).pipe(z.nativeEnum(AuditLogActionType));

export const GuildAuditLogController = (app: HonoApp) => {
	app.get(
		'/guilds/:guild_id/audit-logs',
		RateLimitMiddleware(RateLimitConfigs.GUILD_AUDIT_LOGS),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({guild_id: Int64Type})),
		Validator(
			'query',
			z.object({
				limit: coerceNumberFromString(Int32Type.max(100)).optional(),
				before: Int64Type.optional(),
				after: Int64Type.optional(),
				user_id: Int64Type.optional(),
				action_type: actionTypeSchema.optional(),
			}),
		),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const guildId = createGuildID(ctx.req.valid('param').guild_id);
			const query = ctx.req.valid('query');

			if (query.before !== undefined && query.after !== undefined) {
				throw InputValidationError.create('before', 'Нельзя указать одновременно before и after');
			}

			const requestCache = ctx.get('requestCache');
			const response = await ctx.get('guildService').listGuildAuditLogs({
				userId,
				guildId,
				requestCache,
				limit: query.limit ?? undefined,
				beforeLogId: query.before ?? undefined,
				afterLogId: query.after ?? undefined,
				filterUserId: query.user_id ? createUserID(query.user_id) : undefined,
				actionType: query.action_type,
			});

			return ctx.json(response);
		},
	);
};
