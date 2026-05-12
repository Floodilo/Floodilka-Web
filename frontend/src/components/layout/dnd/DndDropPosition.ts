/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {XYCoord} from 'react-dnd';

export function computeVerticalDropPosition(
	clientOffset: XYCoord,
	boundingRect: DOMRect,
	edgeThreshold: number = 0.5,
): 'before' | 'after' | 'center' {
	const height = boundingRect.bottom - boundingRect.top;
	const offsetY = clientOffset.y - boundingRect.top;

	if (edgeThreshold >= 0.5) {
		return offsetY < height / 2 ? 'before' : 'after';
	}

	const threshold = height * edgeThreshold;
	if (offsetY < threshold) return 'before';
	if (offsetY > height - threshold) return 'after';
	return 'center';
}
