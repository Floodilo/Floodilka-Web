/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {coerceNumberFromString, createStringType, FilenameType, Int32Type, z} from '~/Schema';

export const ClientAttachmentRequest = z.object({
	id: coerceNumberFromString(Int32Type),
	filename: FilenameType,
	title: createStringType(1, 1024).nullish(),
	description: createStringType(1, 1024).nullish(),
	flags: coerceNumberFromString(Int32Type).default(0),
});
export type ClientAttachmentRequest = z.infer<typeof ClientAttachmentRequest>;

export interface UploadedAttachment {
	id: number;
	filename: string;
	upload_filename: string;
	file_size: number;
	content_type: string;
}

export interface AttachmentToProcess {
	id: number;
	filename: string;
	upload_filename: string;
	title: string | null;
	description: string | null;
	flags: number;
	file_size: number;
	content_type: string;
}

export const ClientAttachmentReferenceRequest = z.object({
	id: coerceNumberFromString(Int32Type),
	filename: FilenameType.optional(),
	title: createStringType(1, 1024).nullish(),
	description: createStringType(1, 1024).nullish(),
	flags: coerceNumberFromString(Int32Type).default(0),
});
export type ClientAttachmentReferenceRequest = z.infer<typeof ClientAttachmentReferenceRequest>;

export function mergeUploadWithClientData(
	uploaded: UploadedAttachment,
	clientData?: ClientAttachmentRequest | ClientAttachmentReferenceRequest,
): AttachmentToProcess {
	return {
		id: uploaded.id,
		filename: uploaded.filename,
		upload_filename: uploaded.upload_filename,
		file_size: uploaded.file_size,
		content_type: uploaded.content_type,
		title: clientData?.title ?? null,
		description: clientData?.description ?? null,
		flags: 'flags' in (clientData ?? {}) ? (clientData as ClientAttachmentRequest).flags : 0,
	};
}

export type AttachmentRequestData = AttachmentToProcess | ClientAttachmentRequest | ClientAttachmentReferenceRequest;
