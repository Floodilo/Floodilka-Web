/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export function getAdaptivePadding(): number {
	const width = window.innerWidth;
	const height = window.innerHeight;
	const minDimension = Math.min(width, height);

	if (minDimension < 400) return 4;
	if (minDimension < 768) return 8;
	if (minDimension < 1024) return 12;
	return 16;
}
