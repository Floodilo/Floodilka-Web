/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Hono} from 'hono';
import {z} from 'zod';
import type {HonoEnv} from '~/App';
import {createChannelID, createMessageID} from '~/BrandedTypes';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type} from '~/Schema';
import {Validator} from '~/Validator';

export function ReadStateController(app: Hono<HonoEnv>): void {
	app.post(
		'/read-states/ack-bulk',
		RateLimitMiddleware(RateLimitConfigs.READ_STATE_ACK_BULK),
		LoginRequired,
		DefaultUserOnly,
		Validator(
			'json',
			z.object({
				read_states: z
					.array(z.object({channel_id: Int64Type, message_id: Int64Type}))
					.min(1)
					.max(100),
			}),
		),
		async (ctx) => {
			await ctx.get('readStateService').bulkAckMessages({
				userId: ctx.get('user').id,
				readStates: ctx.req.valid('json').read_states.map((rs) => ({
					channelId: createChannelID(rs.channel_id),
					messageId: createMessageID(rs.message_id),
				})),
			});
			return ctx.body(null, 204);
		},
	);
}
