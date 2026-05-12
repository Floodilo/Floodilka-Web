/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {createChannelID} from '~/BrandedTypes';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';
import {parseScheduledMessageInput} from './ScheduledMessageParsing';

export const ScheduledMessageController = (app: HonoApp) => {
	app.post(
		'/channels/:channel_id/messages/schedule',
		RateLimitMiddleware(RateLimitConfigs.CHANNEL_MESSAGE_CREATE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({channel_id: Int64Type})),
		async (ctx) => {
			const user = ctx.get('user');
			const channelId = createChannelID(ctx.req.valid('param').channel_id);
			const scheduledMessageService = ctx.get('scheduledMessageService');

			const {message, scheduledLocalAt, timezone} = await parseScheduledMessageInput({
				ctx,
				userId: user.id,
				channelId,
			});

			const scheduledMessage = await scheduledMessageService.createScheduledMessage({
				user,
				channelId,
				data: message,
				scheduledLocalAt,
				timezone,
			});

			return ctx.json(scheduledMessage.toResponse(), 201);
		},
	);
};
