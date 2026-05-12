/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export enum StateFlags {
	SIZE = 1,
	POSITION = 2,
	MAXIMIZED = 4,
	FULLSCREEN = 8,
	DECORATIONS = 16,
	VISIBLE = 32,
	ALL = SIZE | POSITION | MAXIMIZED | FULLSCREEN | DECORATIONS | VISIBLE,
}

export async function saveCurrentWindowState(_flags: StateFlags = StateFlags.ALL): Promise<void> {}

export function buildStateFlags(_options: {
	rememberSizeAndPosition: boolean;
	rememberMaximized: boolean;
	rememberFullscreen: boolean;
}): StateFlags {
	return StateFlags.ALL;
}
