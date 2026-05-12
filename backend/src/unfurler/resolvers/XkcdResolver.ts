/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {selectOne} from 'css-select';
import type {Document, Element, Text} from 'domhandler';
import {parseDocument} from 'htmlparser2';
import type {MessageEmbedResponse} from '~/channel/EmbedTypes';
import {BaseResolver} from '~/unfurler/resolvers/BaseResolver';
import {parseString} from '~/utils/StringUtils';

export class XkcdResolver extends BaseResolver {
	match(url: URL, mimeType: string, _content: Uint8Array): boolean {
		return mimeType.startsWith('text/html') && url.hostname === 'xkcd.com';
	}

	async resolve(url: URL, content: Uint8Array, isNSFWAllowed: boolean = false): Promise<Array<MessageEmbedResponse>> {
		const document = parseDocument(Buffer.from(content).toString('utf-8'));
		const title = this.extractTitle(document);
		const imageUrl = this.extractImageURL(document);
		const imageMedia = await this.resolveMediaURL(url, imageUrl, isNSFWAllowed);
		const imageAlt = this.extractImageAlt(document);
		const footerText = this.extractFooterText(document);
		if (imageMedia) {
			imageMedia.description = imageAlt;
		}
		const embed: MessageEmbedResponse = {
			type: 'rich',
			url: url.href,
			title: title ? parseString(title, 70) : undefined,
			color: 0x000000,
			image: imageMedia ?? undefined,
			footer: footerText ? {text: footerText} : undefined,
		};
		return [embed];
	}

	private extractTitle(document: Document): string | undefined {
		const ogTitle = this.extractMetaField(document, 'og:title');
		if (ogTitle) {
			return ogTitle;
		}
		const titleElement = selectOne('title', document) as Element | null;
		if (titleElement && titleElement.children.length > 0) {
			const titleText = titleElement.children[0] as Text;
			return titleText.data;
		}
		return;
	}

	private extractImageURL(document: Document): string | undefined {
		return this.extractMetaField(document, 'og:image');
	}

	private extractImageAlt(document: Document): string | undefined {
		const imageElement = selectOne('#comic img', document) as Element | null;
		return imageElement ? imageElement.attribs.title : undefined;
	}

	private extractFooterText(document: Document): string | undefined {
		const imageElement = selectOne('#comic img', document) as Element | null;
		return imageElement ? imageElement.attribs.title : undefined;
	}

	private extractMetaField(document: Document, property: string, attribute = 'content'): string | undefined {
		const element = selectOne(`meta[property="${property}"], meta[name="${property}"]`, document) as Element | null;
		return element?.attribs[attribute] ?? undefined;
	}
}
