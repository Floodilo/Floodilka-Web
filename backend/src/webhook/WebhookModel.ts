/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {AVATAR_MAX_SIZE} from '~/Constants';
import {MessageRequest} from '~/channel/ChannelModel';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import type {Webhook} from '~/Models';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import {createBase64StringType, Int64Type, URLType, WebhookNameType, z} from '~/Schema';
import {getCachedUserPartialResponse} from '~/user/UserCacheHelpers';
import {UserPartialResponse} from '~/user/UserModel';

export const WebhookResponse = z.object({
	id: z.string(),
	guild_id: z.string(),
	channel_id: z.string(),
	user: z.lazy(() => UserPartialResponse),
	name: z.string(),
	avatar: z.string().nullish(),
	token: z.string(),
});

export type WebhookResponse = z.infer<typeof WebhookResponse>;

export const WebhookCreateRequest = z.object({
	name: WebhookNameType,
	avatar: createBase64StringType(1, AVATAR_MAX_SIZE * 1.33).nullish(),
});

export type WebhookCreateRequest = z.infer<typeof WebhookCreateRequest>;

export const WebhookUpdateRequest = z
	.object({
		name: WebhookNameType,
		avatar: createBase64StringType(1, AVATAR_MAX_SIZE * 1.33).nullish(),
		channel_id: Int64Type,
	})
	.partial();

export type WebhookUpdateRequest = z.infer<typeof WebhookUpdateRequest>;

export const WebhookMessageRequest = z.object({
	...MessageRequest.shape,
	username: WebhookNameType.nullish(),
	avatar_url: URLType.nullish(),
});

export type WebhookMessageRequest = z.infer<typeof WebhookMessageRequest>;

export async function mapWebhookToResponseWithCache({
	webhook,
	userCacheService,
	requestCache,
}: {
	webhook: Webhook;
	userCacheService: UserCacheService;
	requestCache: RequestCache;
}): Promise<WebhookResponse> {
	const creatorPartial = await getCachedUserPartialResponse({
		userId: webhook.creatorId!,
		userCacheService,
		requestCache,
	});
	if (!creatorPartial) {
		throw new Error(`Creator user ${webhook.creatorId} not found for webhook`);
	}
	return {
		id: webhook.id.toString(),
		guild_id: webhook.guildId?.toString() || '',
		channel_id: webhook.channelId?.toString() || '',
		user: creatorPartial,
		name: webhook.name || '',
		avatar: webhook.avatarHash,
		token: webhook.token,
	};
}

export async function mapWebhooksToResponse({
	webhooks,
	userCacheService,
	requestCache,
}: {
	webhooks: Array<Webhook>;
	userCacheService: UserCacheService;
	requestCache: RequestCache;
}): Promise<Array<WebhookResponse>> {
	return await Promise.all(
		webhooks.map((webhook) => mapWebhookToResponseWithCache({webhook, userCacheService, requestCache})),
	);
}
