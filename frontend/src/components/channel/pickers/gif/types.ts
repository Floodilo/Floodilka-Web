/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {KlipyGif} from '~/actions/KlipyActionCreators';

export type View = 'default' | 'trending';

export type GifGridItem =
	| {
			type: 'category';
			key: string;
			id: string;
			title: string;
			categoryKind: 'favorites' | 'trending' | 'category';
			previewUrl: string;
			previewProxySrc: string;
			width: number;
			height: number;
	  }
	| {
			type: 'gif';
			key: string;
			gif: KlipyGif;
	  }
	| {
			type: 'skeleton';
			key: string;
			width: number;
			height: number;
	  };
