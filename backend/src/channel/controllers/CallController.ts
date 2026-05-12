/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createChannelID, createUserID} from '~/BrandedTypes';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {createStringType, Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';

export const CallController = (app: HonoApp) => {
	app.get(
		'/channels/:channel_id/call',
		RateLimitMiddleware(RateLimitConfigs.CHANNEL_CALL_GET),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({channel_id: Int64Type})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const channelId = createChannelID(ctx.req.valid('param').channel_id);
			const channelService = ctx.get('channelService');

			const {ringable, silent} = await channelService.checkCallEligibility({userId, channelId});

			return ctx.json({ringable, silent});
		},
	);

	app.patch(
		'/channels/:channel_id/call',
		RateLimitMiddleware(RateLimitConfigs.CHANNEL_CALL_UPDATE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({channel_id: Int64Type})),
		Validator('json', z.object({region: createStringType(1, 64).optional()})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const channelId = createChannelID(ctx.req.valid('param').channel_id);
			const {region} = ctx.req.valid('json');
			const channelService = ctx.get('channelService');

			await channelService.updateCall({userId, channelId, region});

			return ctx.body(null, 204);
		},
	);

	app.post(
		'/channels/:channel_id/call/ring',
		RateLimitMiddleware(RateLimitConfigs.CHANNEL_CALL_RING),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({channel_id: Int64Type})),
		Validator('json', z.object({recipients: z.array(Int64Type).optional()})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const channelId = createChannelID(ctx.req.valid('param').channel_id);
			const {recipients} = ctx.req.valid('json');
			const channelService = ctx.get('channelService');
			const requestCache = ctx.get('requestCache');

			const recipientIds = recipients ? recipients.map(createUserID) : undefined;

			await channelService.ringCallRecipients({
				userId,
				channelId,
				recipients: recipientIds,
				requestCache,
			});

			return ctx.body(null, 204);
		},
	);

	app.post(
		'/channels/:channel_id/call/stop-ringing',
		RateLimitMiddleware(RateLimitConfigs.CHANNEL_CALL_STOP_RINGING),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({channel_id: Int64Type})),
		Validator('json', z.object({recipients: z.array(Int64Type).optional()})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const channelId = createChannelID(ctx.req.valid('param').channel_id);
			const {recipients} = ctx.req.valid('json');
			const channelService = ctx.get('channelService');

			const recipientIds = recipients ? recipients.map(createUserID) : undefined;

			await channelService.stopRingingCallRecipients({
				userId,
				channelId,
				recipients: recipientIds,
			});

			return ctx.body(null, 204);
		},
	);
};
