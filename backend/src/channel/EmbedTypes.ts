/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {AttachmentURLType, ColorType, createStringType, DateTimeType, URLType, z} from '~/Schema';

export const RichEmbedAuthorRequest = z.object({
	name: createStringType(),
	url: URLType.nullish(),
	icon_url: URLType.nullish(),
});
export type RichEmbedAuthorRequest = z.infer<typeof RichEmbedAuthorRequest>;

export const RichEmbedMediaRequest = z.object({
	url: AttachmentURLType,
	description: createStringType(1, 4096).nullish(),
});
export type RichEmbedMediaRequest = z.infer<typeof RichEmbedMediaRequest>;

export interface RichEmbedMediaWithMetadata extends RichEmbedMediaRequest {
	_attachmentMetadata?: {
		width: number | null;
		height: number | null;
		content_type: string;
		content_hash: string | null;
		placeholder: string | null;
		flags: number;
		duration: number | null;
		nsfw: boolean | null;
	};
}

export const RichEmbedFooterRequest = z.object({
	text: createStringType(1, 2048),
	icon_url: URLType.nullish(),
});
export type RichEmbedFooterRequest = z.infer<typeof RichEmbedFooterRequest>;

const RichEmbedFieldRequest = z.object({
	name: createStringType(),
	value: createStringType(1, 1024),
	inline: z.boolean().default(false),
});

export const RichEmbedRequest = z.object({
	url: URLType.nullish(),
	title: createStringType().nullish(),
	color: ColorType.nullish(),
	timestamp: DateTimeType.nullish(),
	description: createStringType(1, 4096).nullish(),
	author: RichEmbedAuthorRequest.nullish(),
	image: RichEmbedMediaRequest.nullish(),
	thumbnail: RichEmbedMediaRequest.nullish(),
	footer: RichEmbedFooterRequest.nullish(),
	fields: z.array(RichEmbedFieldRequest).max(25).nullish(),
});
export type RichEmbedRequest = z.infer<typeof RichEmbedRequest>;

const EmbedAuthorResponse = z.object({
	name: z.string(),
	url: z.url().nullish(),
	icon_url: z.url().nullish(),
	proxy_icon_url: z.url().nullish(),
});

const EmbedFooterResponse = z.object({
	text: z.string(),
	icon_url: z.url().nullish(),
	proxy_icon_url: z.url().nullish(),
});

const EmbedMediaResponse = z.object({
	url: z.string(),
	proxy_url: z.url().nullish(),
	content_type: z.string().nullish(),
	content_hash: z.string().nullish(),
	width: z.number().int().nullish(),
	height: z.number().int().nullish(),
	description: z.string().nullish(),
	placeholder: z.string().nullish(),
	duration: z.number().int().nullish(),
	flags: z.number().int(),
});

const EmbedFieldResponse = z.object({
	name: z.string(),
	value: z.string(),
	inline: z.boolean(),
});
export type EmbedFieldResponse = z.infer<typeof EmbedFieldResponse>;

export const MessageEmbedResponse = z.object({
	type: z.string(),
	url: z.url().nullish(),
	title: z.string().nullish(),
	color: z.number().int().nullish(),
	timestamp: z.iso.datetime().nullish(),
	description: z.string().nullish(),
	author: EmbedAuthorResponse.nullish(),
	image: EmbedMediaResponse.nullish(),
	thumbnail: EmbedMediaResponse.nullish(),
	footer: EmbedFooterResponse.nullish(),
	fields: z.array(EmbedFieldResponse).nullish(),
	provider: EmbedAuthorResponse.nullish(),
	video: EmbedMediaResponse.nullish(),
	audio: EmbedMediaResponse.nullish(),
	nsfw: z.boolean().nullish(),
});
export type MessageEmbedResponse = z.infer<typeof MessageEmbedResponse>;
