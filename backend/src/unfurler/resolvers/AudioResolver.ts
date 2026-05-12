/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbedResponse} from '~/channel/EmbedTypes';
import {BaseResolver} from '~/unfurler/resolvers/BaseResolver';
import {buildEmbedMediaPayload} from '~/unfurler/resolvers/media/MediaMetadataHelpers';

export class AudioResolver extends BaseResolver {
	match(_url: URL, mimeType: string, _content: Uint8Array): boolean {
		return mimeType.startsWith('audio/');
	}

	async resolve(url: URL, content: Uint8Array, isNSFWAllowed: boolean = false): Promise<Array<MessageEmbedResponse>> {
		const metadata = await this.mediaService.getMetadata({
			type: 'base64',
			base64: Buffer.from(content).toString('base64'),
			isNSFWAllowed,
		});
		return [
			{
				type: 'audio',
				url: url.href,
				audio: buildEmbedMediaPayload(url.href, metadata),
			},
		];
	}
}
