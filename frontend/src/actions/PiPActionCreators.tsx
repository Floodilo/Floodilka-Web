/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import PiPStore, {type PiPContent, type PiPCorner} from '~/stores/PiPStore';

export function openPiP(content: PiPContent): void {
	PiPStore.open(content);
}

export function closePiP(): void {
	PiPStore.close();
}

export function showFocusedTileMirror(content: PiPContent, corner: PiPCorner = 'top-right'): void {
	PiPStore.showFocusedTileMirror(content, corner);
}

export function hideFocusedTileMirror(): void {
	PiPStore.hideFocusedTileMirror();
}
