/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MessageAttachmentFlags} from '~/Constants';
import type {MessageEmbedResponse} from '~/channel/EmbedTypes';
import type {MediaProxyMetadataResponse} from '~/infrastructure/IMediaService';

interface BuildMediaOptions {
	width?: number;
	height?: number;
	description?: string;
}

export function buildEmbedMediaPayload(
	url: string,
	metadata: MediaProxyMetadataResponse | null,
	options: BuildMediaOptions = {},
): MessageEmbedResponse['image'] {
	const flags =
		(metadata?.animated ? MessageAttachmentFlags.IS_ANIMATED : 0) |
		(metadata?.nsfw ? MessageAttachmentFlags.CONTAINS_EXPLICIT_MEDIA : 0);

	return {
		url,
		width: options.width ?? metadata?.width ?? undefined,
		height: options.height ?? metadata?.height ?? undefined,
		description: options.description ?? undefined,
		placeholder: metadata?.placeholder ?? undefined,
		flags,
		content_hash: metadata?.content_hash ?? undefined,
		content_type: metadata?.content_type ?? undefined,
		duration: metadata?.duration ?? undefined,
	};
}
