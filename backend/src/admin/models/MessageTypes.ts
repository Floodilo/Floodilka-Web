/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {FilenameType, Int64Type, z} from '~/Schema';

export const LookupMessageRequest = z.object({
	channel_id: Int64Type,
	message_id: Int64Type,
	context_limit: z.number().default(50),
});

export type LookupMessageRequest = z.infer<typeof LookupMessageRequest>;

export const LookupMessageByAttachmentRequest = z.object({
	channel_id: Int64Type,
	attachment_id: Int64Type,
	filename: FilenameType,
	context_limit: z.number().default(50),
});

export type LookupMessageByAttachmentRequest = z.infer<typeof LookupMessageByAttachmentRequest>;

export const DeleteMessageRequest = z.object({
	channel_id: Int64Type,
	message_id: Int64Type,
});

export type DeleteMessageRequest = z.infer<typeof DeleteMessageRequest>;

const MessageShredEntryType = z.object({
	channel_id: Int64Type,
	message_id: Int64Type,
});

export const MessageShredRequest = z.object({
	user_id: Int64Type,
	entries: z.array(MessageShredEntryType).min(1),
});

export type MessageShredRequest = z.infer<typeof MessageShredRequest>;

export const MessageShredResponse = z.object({
	success: z.literal(true),
	job_id: z.string(),
	requested: z.number().int().min(0).optional(),
});

export type MessageShredResponse = z.infer<typeof MessageShredResponse>;

export const MessageShredStatusRequest = z.object({
	job_id: z.string(),
});

export type MessageShredStatusRequest = z.infer<typeof MessageShredStatusRequest>;

export const DeleteAllUserMessagesRequest = z.object({
	user_id: Int64Type,
	dry_run: z.boolean().default(true),
});

export type DeleteAllUserMessagesRequest = z.infer<typeof DeleteAllUserMessagesRequest>;

export const DeleteAllUserMessagesResponse = z.object({
	success: z.literal(true),
	dry_run: z.boolean(),
	channel_count: z.number().int(),
	message_count: z.number().int(),
	job_id: z.string().optional(),
});

export type DeleteAllUserMessagesResponse = z.infer<typeof DeleteAllUserMessagesResponse>;
