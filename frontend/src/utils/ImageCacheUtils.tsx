/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {LRUCache} from 'lru-cache';

interface ImageCacheEntry {
	loaded: boolean;
}

const imageCache = new LRUCache<string, ImageCacheEntry>({
	max: 500,
	ttl: 1000 * 60 * 10,
});

const isCached = (src: string | null): boolean => {
	if (!src) return false;
	return imageCache.has(src);
};

export const hasImage = (src: string | null): boolean => {
	return isCached(src);
};

export const loadImage = (src: string | null, onLoad: () => void, onError?: () => void): void => {
	if (!src) {
		onError?.();
		return;
	}

	if (imageCache.has(src)) {
		onLoad();
		return;
	}

	const image = new Image();

	image.onload = () => {
		imageCache.set(src, {loaded: true});
		onLoad();
	};

	image.onerror = () => {
		onError?.();
	};

	image.src = src;
};
