/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createApplicationID, createUserID} from '~/BrandedTypes';
import {AdminACLs} from '~/Constants';
import {UnknownApplicationError} from '~/Errors';
import {requireAdminACL} from '~/middleware/AdminMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {mapApplicationToResponse, mapBotTokenResetResponse} from '~/oauth/OAuth2Mappers';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';

export const ApplicationAdminController = (app: HonoApp) => {
	app.post(
		'/admin/applications/list-by-owner',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.APPLICATION_LIST),
		Validator('json', z.object({owner_user_id: Int64Type})),
		async (ctx) => {
			const {owner_user_id} = ctx.req.valid('json');
			const ownerId = createUserID(owner_user_id);
			const applications = await ctx.get('applicationRepository').listApplicationsByOwner(ownerId);

			const responses = await Promise.all(
				applications.map(async (application) => {
					let botUser = null;
					if (application.hasBotUser() && application.getBotUserId()) {
						botUser = await ctx.get('userRepository').findUnique(application.getBotUserId()!);
					}
					return mapApplicationToResponse(application, {botUser});
				}),
			);

			return ctx.json({applications: responses});
		},
	);

	app.get(
		'/admin/applications/:application_id',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.APPLICATION_LOOKUP),
		Validator('param', z.object({application_id: Int64Type})),
		async (ctx) => {
			const {application_id} = ctx.req.valid('param');
			const applicationId = createApplicationID(application_id);
			const application = await ctx.get('applicationRepository').getApplication(applicationId);
			if (!application) {
				throw new UnknownApplicationError();
			}

			let botUser = null;
			if (application.hasBotUser() && application.getBotUserId()) {
				botUser = await ctx.get('userRepository').findUnique(application.getBotUserId()!);
			}

			const botTokens = await ctx.get('applicationRepository').listBotTokensByClient(applicationId);

			return ctx.json({
				application: mapApplicationToResponse(application, {botUser}),
				bot_tokens: botTokens.map((row) => ({
					created_at: row.created_at.toISOString(),
					scopes: Array.from(row.scopes),
				})),
			});
		},
	);

	app.delete(
		'/admin/applications/:application_id',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.APPLICATION_DELETE),
		Validator('param', z.object({application_id: Int64Type})),
		async (ctx) => {
			const {application_id} = ctx.req.valid('param');
			const applicationId = createApplicationID(application_id);
			await ctx.get('applicationService').adminDeleteApplication(applicationId);
			return ctx.body(null, 204);
		},
	);

	app.post(
		'/admin/applications/:application_id/revoke-bot-token',
		RateLimitMiddleware(RateLimitConfigs.ADMIN_LOOKUP),
		requireAdminACL(AdminACLs.APPLICATION_REVOKE_BOT_TOKEN),
		Validator('param', z.object({application_id: Int64Type})),
		async (ctx) => {
			const {application_id} = ctx.req.valid('param');
			const applicationId = createApplicationID(application_id);
			const {token} = await ctx.get('applicationService').adminRotateBotToken(applicationId);

			const application = await ctx.get('applicationRepository').getApplication(applicationId);
			if (!application || !application.getBotUserId()) {
				throw new UnknownApplicationError();
			}
			const botUser = await ctx.get('userRepository').findUnique(application.getBotUserId()!);
			if (!botUser) {
				throw new UnknownApplicationError();
			}

			return ctx.json(mapBotTokenResetResponse(botUser, token));
		},
	);
};
