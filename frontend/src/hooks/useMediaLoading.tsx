/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect, useMemo, useState} from 'react';
import {thumbHashToDataURL} from 'thumbhash';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import * as ImageCacheUtils from '~/utils/ImageCacheUtils';

interface MediaLoadingState {
	loaded: boolean;
	error: boolean;
	thumbHashURL?: string;
}

export function useMediaLoading(src: string, placeholder?: string): MediaLoadingState {
	const [loadingState, setLoadingState] = useState<Omit<MediaLoadingState, 'thumbHashURL'>>({
		loaded: ImageCacheUtils.hasImage(src),
		error: false,
	});

	const thumbHashURL = useMemo(() => {
		if (!placeholder) return;
		try {
			const bytes = Uint8Array.from(atob(placeholder), (c) => c.charCodeAt(0));
			return thumbHashToDataURL(bytes);
		} catch {
			return;
		}
	}, [placeholder]);

	useEffect(() => {
		if (DeveloperOptionsStore.forceRenderPlaceholders || DeveloperOptionsStore.forceMediaLoading) {
			return;
		}

		ImageCacheUtils.loadImage(
			src,
			() => setLoadingState({loaded: true, error: false}),
			() => setLoadingState({loaded: false, error: true}),
		);
	}, [src]);

	return {...loadingState, thumbHashURL};
}
