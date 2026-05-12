/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {AVATAR_MAX_SIZE, ChannelTypes} from '~/Constants';
import {createBase64StringType, createStringType, GeneralChannelNameType, Int64Type, z} from '~/Schema';
import {UserPartialResponse} from '~/user/UserModel';

const ChannelOverwriteResponse = z.object({
	id: z.string(),
	type: z.number().int(),
	allow: z.string(),
	deny: z.string(),
});
export type ChannelOverwriteResponse = z.infer<typeof ChannelOverwriteResponse>;

export const ChannelResponse = z.object({
	id: z.string(),
	guild_id: z.string().optional(),
	name: z.string().optional(),
	topic: z.string().nullish(),
	icon: z.string().nullish(),
	owner_id: z.string().nullish(),
	type: z.number().int(),
	position: z.number().int().optional(),
	parent_id: z.string().nullish(),
	bitrate: z.number().int().nullish(),
	user_limit: z.number().int().nullish(),
	rtc_region: z.string().nullish(),
	last_message_id: z.string().nullish(),
	last_pin_timestamp: z.iso.datetime().nullish(),
	permission_overwrites: z.array(ChannelOverwriteResponse).optional(),
	recipients: z.array(z.lazy(() => UserPartialResponse)).optional(),
	nsfw: z.boolean().optional(),
	rate_limit_per_user: z.number().int().optional(),
	nicks: z.record(z.string(), createStringType(1, 32)).optional(),
});
export type ChannelResponse = z.infer<typeof ChannelResponse>;

export const ChannelPartialResponse = z.object({
	id: z.string(),
	name: z.string().nullish(),
	type: z.number().int(),
	recipients: z
		.array(
			z.object({
				username: z.string(),
			}),
		)
		.optional(),
});
export type ChannelPartialResponse = z.infer<typeof ChannelPartialResponse>;

const ChannelOverwriteRequest = z.object({
	id: Int64Type,
	type: z.union([z.literal(0), z.literal(1)]),
	allow: Int64Type.optional(),
	deny: Int64Type.optional(),
});

const CreateCommon = z.object({
	topic: createStringType(1, 1024).nullish(),
	parent_id: Int64Type.nullish(),
	bitrate: z.number().int().min(8000).max(320000).nullish(),
	user_limit: z.number().int().min(0).max(99).nullish(),
	nsfw: z.boolean().default(false),
	permission_overwrites: z.array(ChannelOverwriteRequest).optional(),
});

const UpdateCommon = z.object({
	topic: createStringType(1, 1024).nullish(),
	parent_id: Int64Type.nullish(),
	bitrate: z.number().int().min(8000).max(320000).nullish(),
	user_limit: z.number().int().min(0).max(99).nullish(),
	nsfw: z.boolean().nullish(),
	rate_limit_per_user: z.number().int().min(0).max(21600).nullish(),
	icon: createBase64StringType(1, AVATAR_MAX_SIZE * 1.33).nullish(),
	owner_id: Int64Type.nullish(),
	permission_overwrites: z.array(ChannelOverwriteRequest).optional(),
	nicks: z.record(createStringType(0, 32), z.union([createStringType(0, 32), z.null()])).optional(),
	rtc_region: createStringType(1, 64).nullish(),
});

const CreateText = CreateCommon.extend({
	type: z.literal(ChannelTypes.GUILD_TEXT),
	name: GeneralChannelNameType,
});

const CreateVoice = CreateCommon.extend({
	type: z.literal(ChannelTypes.GUILD_VOICE),
	name: GeneralChannelNameType,
});

const CreateCat = CreateCommon.extend({
	type: z.literal(ChannelTypes.GUILD_CATEGORY),
	name: GeneralChannelNameType,
});

export const ChannelCreateRequest = z.discriminatedUnion('type', [CreateText, CreateVoice, CreateCat]);
export type ChannelCreateRequest = z.infer<typeof ChannelCreateRequest>;

const UpdateText = UpdateCommon.extend({
	type: z.literal(ChannelTypes.GUILD_TEXT),
	name: GeneralChannelNameType.nullish(),
});

const UpdateVoice = UpdateCommon.extend({
	type: z.literal(ChannelTypes.GUILD_VOICE),
	name: GeneralChannelNameType.nullish(),
});

const UpdateCat = UpdateCommon.extend({
	type: z.literal(ChannelTypes.GUILD_CATEGORY),
	name: GeneralChannelNameType.nullish(),
});

const UpdateGroupDm = z.object({
	type: z.literal(ChannelTypes.GROUP_DM),
	name: GeneralChannelNameType.nullish(),
	icon: createBase64StringType(1, AVATAR_MAX_SIZE * 1.33).nullish(),
	owner_id: Int64Type.nullish(),
	nicks: z.record(createStringType(0, 32), z.union([createStringType(0, 32), z.null()])).nullish(),
});

export const ChannelUpdateRequest = z.discriminatedUnion('type', [
	UpdateText,
	UpdateVoice,
	UpdateCat,
	UpdateGroupDm,
]);
export type ChannelUpdateRequest = z.infer<typeof ChannelUpdateRequest>;
