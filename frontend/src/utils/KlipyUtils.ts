/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export function parseTitleFromUrl(url: string): string {
	if (!url) return '';

	const klipyMatch = url.match(/klipy\.com\/gif\/([^?]+)/);
	if (klipyMatch?.[1]) {
		return klipyMatch[1]
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	const srcMatch = url.match(/\/([^/]+?)(?:\.[^.]+)?$/);
	if (srcMatch?.[1]) {
		return srcMatch[1]
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	return 'GIF';
}
