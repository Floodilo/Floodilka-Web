/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Context} from 'hono';
import type {HonoApp, HonoEnv} from '~/App';
import {createMessageID} from '~/BrandedTypes';
import {parseScheduledMessageInput} from '~/channel/controllers/ScheduledMessageParsing';
import {UnknownMessageError} from '~/Errors';
import {DefaultUserOnly, LoginRequired} from '~/middleware/AuthMiddleware';
import {RateLimitMiddleware} from '~/middleware/RateLimitMiddleware';
import {RateLimitConfigs} from '~/RateLimitConfig';
import {Int64Type, z} from '~/Schema';
import {Validator} from '~/Validator';

export const UserScheduledMessageController = (app: HonoApp) => {
	app.get(
		'/users/@me/scheduled-messages',
		RateLimitMiddleware(RateLimitConfigs.USER_SAVED_MESSAGES_READ),
		LoginRequired,
		DefaultUserOnly,
		async (ctx: Context<HonoEnv>) => {
			const userId = ctx.get('user').id;
			const scheduledMessageService = ctx.get('scheduledMessageService');
			const scheduledMessages = await scheduledMessageService.listScheduledMessages(userId);

			return ctx.json(
				scheduledMessages.map((message) => message.toResponse()),
				200,
			);
		},
	);

	app.get(
		'/users/@me/scheduled-messages/:scheduled_message_id',
		RateLimitMiddleware(RateLimitConfigs.USER_SAVED_MESSAGES_READ),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({scheduled_message_id: Int64Type})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const scheduledMessageId = createMessageID(BigInt(ctx.req.valid('param').scheduled_message_id));
			const scheduledMessageService = ctx.get('scheduledMessageService');
			const scheduledMessage = await scheduledMessageService.getScheduledMessage(userId, scheduledMessageId);

			if (!scheduledMessage) {
				throw new UnknownMessageError();
			}

			return ctx.json(scheduledMessage.toResponse(), 200);
		},
	);

	app.delete(
		'/users/@me/scheduled-messages/:scheduled_message_id',
		RateLimitMiddleware(RateLimitConfigs.USER_SAVED_MESSAGES_WRITE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({scheduled_message_id: Int64Type})),
		async (ctx) => {
			const userId = ctx.get('user').id;
			const scheduledMessageId = createMessageID(BigInt(ctx.req.valid('param').scheduled_message_id));
			const scheduledMessageService = ctx.get('scheduledMessageService');
			await scheduledMessageService.cancelScheduledMessage(userId, scheduledMessageId);
			return ctx.body(null, 204);
		},
	);

	app.patch(
		'/users/@me/scheduled-messages/:scheduled_message_id',
		RateLimitMiddleware(RateLimitConfigs.USER_SAVED_MESSAGES_WRITE),
		LoginRequired,
		DefaultUserOnly,
		Validator('param', z.object({scheduled_message_id: Int64Type})),
		async (ctx) => {
			const user = ctx.get('user');
			const scheduledMessageService = ctx.get('scheduledMessageService');
			const scheduledMessageId = createMessageID(BigInt(ctx.req.valid('param').scheduled_message_id));

			const existingMessage = await scheduledMessageService.getScheduledMessage(user.id, scheduledMessageId);
			if (!existingMessage) {
				throw new UnknownMessageError();
			}
			const channelId = existingMessage.channelId;

			const {message, scheduledLocalAt, timezone} = await parseScheduledMessageInput({
				ctx,
				userId: user.id,
				channelId,
			});

			const scheduledMessage = await scheduledMessageService.updateScheduledMessage({
				user,
				channelId,
				data: message,
				scheduledLocalAt,
				timezone,
				scheduledMessageId,
				existing: existingMessage,
			});

			return ctx.json(scheduledMessage.toResponse(), 200);
		},
	);
};
