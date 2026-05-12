/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createGuildID} from '~/BrandedTypes';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {createStringType, Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';
import {mapPackToSummary, type PackDashboardResponse} from '../PackModel';
import type {PackType} from '../PackRepository';

const PACK_TYPE_PARAM_SCHEMA = z.object({pack_type: z.enum(['emoji', 'sticker'])});

const PackCreateRequest = z.object({
	name: createStringType(1, 64),
	description: createStringType(1, 256).nullish(),
});

const PackUpdateRequest = z.object({
	name: createStringType(1, 64).optional(),
	description: createStringType(1, 256).nullish().optional(),
});

export const PackController = (app: HonoApp) => {
	app.get('/packs', RateLimitMiddleware(RateLimitConfigs.PACKS_LIST), LoginRequired, DefaultUserOnly, async (ctx) => {
		const userId = ctx.get('user').id;
		const response: PackDashboardResponse = await ctx.get('packService').listUserPacks(userId);
		return ctx.json(response);
	});

	app.post(
		'/packs/:pack_type',
		RateLimitMiddleware(RateLimitConfigs.PACKS_CREATE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', PACK_TYPE_PARAM_SCHEMA),
		Validator('json', PackCreateRequest),
		async (ctx) => {
			const {pack_type} = ctx.req.valid('param');
			const {name, description} = ctx.req.valid('json');
			const user = ctx.get('user');
			const pack = await ctx.get('packService').createPack({
				user,
				type: pack_type as PackType,
				name,
				description: description ?? null,
			});
			return ctx.json(mapPackToSummary(pack));
		},
	);

	app.patch(
		'/packs/:pack_id',
		RateLimitMiddleware(RateLimitConfigs.PACKS_UPDATE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({pack_id: Int64Type})),
		Validator('json', PackUpdateRequest),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			const {name, description} = ctx.req.valid('json');
			const updated = await ctx.get('packService').updatePack({
				userId: ctx.get('user').id,
				packId,
				name,
				description,
			});
			return ctx.json(mapPackToSummary(updated));
		},
	);

	app.delete(
		'/packs/:pack_id',
		RateLimitMiddleware(RateLimitConfigs.PACKS_DELETE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({pack_id: Int64Type})),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			await ctx.get('packService').deletePack(ctx.get('user').id, packId);
			return ctx.body(null, 204);
		},
	);

	app.post(
		'/packs/:pack_id/install',
		RateLimitMiddleware(RateLimitConfigs.PACKS_INSTALL),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({pack_id: Int64Type})),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			await ctx.get('packService').installPack(ctx.get('user').id, packId);
			return ctx.body(null, 204);
		},
	);

	app.delete(
		'/packs/:pack_id/install',
		RateLimitMiddleware(RateLimitConfigs.PACKS_INSTALL),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({pack_id: Int64Type})),
		async (ctx) => {
			const packId = createGuildID(ctx.req.valid('param').pack_id);
			await ctx.get('packService').uninstallPack(ctx.get('user').id, packId);
			return ctx.body(null, 204);
		},
	);
};
