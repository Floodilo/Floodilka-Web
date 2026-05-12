/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import type {FavoriteMemeRecord} from '~/records/FavoriteMemeRecord';
import type {EmbedMedia, MessageAttachment, MessageEmbed} from '~/records/MessageRecord';

function extractGifName(url: string): string | null {
	try {
		const klipyRegex = /klipy\.com\/gif\/([a-z0-9-]+)/i;
		const klipyMatch = url.match(klipyRegex);
		if (klipyMatch?.[1]) {
			return klipyMatch[1].split('-').join(' ');
		}
	} catch {}
	return null;
}

function extractFilenameFromUrl(url: string): string | null {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname;
		const filename = pathname.split('/').pop();
		if (!filename) return null;

		const nameWithoutExt = filename.replace(/\.[^.]+$/, '');

		const cleaned = nameWithoutExt.replace(/[-_]/g, ' ').trim();

		return cleaned || null;
	} catch {
		return null;
	}
}

export function deriveDefaultNameFromAttachment(i18n: I18n, attachment: MessageAttachment): string {
	if (attachment.title?.trim()) {
		return attachment.title.trim();
	}

	if (attachment.filename) {
		const nameWithoutExt = attachment.filename.replace(/\.[^.]+$/, '');
		const cleaned = nameWithoutExt.replace(/[-_]/g, ' ').trim();
		if (cleaned) return cleaned;
	}

	if (attachment.url) {
		const urlName = extractFilenameFromUrl(attachment.url);
		if (urlName) return urlName;
	}

	if (attachment.content_type) {
		if (attachment.content_type.startsWith('image/gif')) return i18n._(msg`GIF`);
		if (attachment.content_type.startsWith('image/')) return i18n._(msg`Image`);
		if (attachment.content_type.startsWith('video/')) return i18n._(msg`Video`);
		if (attachment.content_type.startsWith('audio/')) return i18n._(msg`Audio`);
	}

	return i18n._(msg`Media`);
}

export function deriveDefaultNameFromEmbedMedia(i18n: I18n, embedMedia: EmbedMedia, embed?: MessageEmbed): string {
	if (embed?.title?.trim()) {
		return embed.title.trim();
	}

	if (embedMedia.description?.trim()) {
		return embedMedia.description.trim();
	}

	if (embedMedia.url) {
		const gifName = extractGifName(embedMedia.url);
		if (gifName) return gifName;

		const urlName = extractFilenameFromUrl(embedMedia.url);
		if (urlName) return urlName;
	}

	if (embedMedia.content_type) {
		if (embedMedia.content_type.startsWith('image/gif')) return i18n._(msg`GIF`);
		if (embedMedia.content_type.startsWith('image/')) return i18n._(msg`Image`);
		if (embedMedia.content_type.startsWith('video/')) return i18n._(msg`Video`);
		if (embedMedia.content_type.startsWith('audio/')) return i18n._(msg`Audio`);
	}

	return i18n._(msg`Media`);
}

export function isFavoritedByContentHash(
	memes: ReadonlyArray<FavoriteMemeRecord>,
	contentHash: string | null | undefined,
): boolean {
	if (!contentHash) return false;
	return memes.some((meme) => meme.contentHash === contentHash);
}

export function isFavoritedByKlipyId(
	memes: ReadonlyArray<FavoriteMemeRecord>,
	klipyId: string | null | undefined,
): boolean {
	if (!klipyId) return false;
	return memes.some((meme) => meme.klipyId === klipyId);
}

export function isFavorited(
	memes: ReadonlyArray<FavoriteMemeRecord>,
	params: {contentHash?: string | null; klipyId?: string | null},
): boolean {
	if (params.klipyId) {
		return isFavoritedByKlipyId(memes, params.klipyId);
	}
	if (params.contentHash) {
		return isFavoritedByContentHash(memes, params.contentHash);
	}
	return false;
}

export function findFavoritedMeme(
	memes: ReadonlyArray<FavoriteMemeRecord>,
	params: {contentHash?: string | null; klipyId?: string | null},
): FavoriteMemeRecord | null {
	if (params.klipyId) {
		return memes.find((meme) => meme.klipyId === params.klipyId) ?? null;
	}
	if (params.contentHash) {
		return memes.find((meme) => meme.contentHash === params.contentHash) ?? null;
	}
	return null;
}
