/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbedResponse} from '~/channel/EmbedTypes';
import type {IMediaService} from '~/infrastructure/IMediaService';
import {Logger} from '~/Logger';
import {URLType} from '~/Schema';
import {buildEmbedMediaPayload} from '~/unfurler/resolvers/media/MediaMetadataHelpers';

export abstract class BaseResolver {
	constructor(protected mediaService: IMediaService) {}

	abstract match(url: URL, mimeType: string, content: Uint8Array): boolean;
	abstract resolve(url: URL, content: Uint8Array, isNSFWAllowed?: boolean): Promise<Array<MessageEmbedResponse>>;

	protected resolveRelativeURL(baseUrl: string, relativeUrl?: string): string | null {
		if (!relativeUrl) {
			return null;
		}
		try {
			return new URL(relativeUrl, baseUrl).href;
		} catch (error) {
			Logger.error({error}, 'Failed to resolve relative URL');
			return relativeUrl;
		}
	}

	protected async resolveMediaURL(
		url: URL,
		mediaUrl?: string | null,
		isNSFWAllowed: boolean = false,
	): Promise<MessageEmbedResponse['image']> {
		if (!mediaUrl) {
			return null;
		}

		const resolvedUrl = this.resolveRelativeURL(url.href, mediaUrl);
		if (resolvedUrl && URLType.safeParse(resolvedUrl).success) {
			try {
				const metadata = await this.mediaService.getMetadata({
					type: 'external',
					url: resolvedUrl,
					isNSFWAllowed,
				});
				return buildEmbedMediaPayload(resolvedUrl, metadata);
			} catch (error) {
				Logger.error({error}, 'Failed to resolve media URL metadata');
				return null;
			}
		}

		return null;
	}
}
