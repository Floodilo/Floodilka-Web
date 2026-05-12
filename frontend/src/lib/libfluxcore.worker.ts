/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import initLibfluxcore, * as wasm from '@pkgs/libfluxcore/libfluxcore';

let modulePromise: Promise<void> | null = null;

async function loadModule(): Promise<void> {
	if (!modulePromise) {
		modulePromise = (async () => {
			if (typeof initLibfluxcore === 'function') {
				await initLibfluxcore();
			}
		})();
	}
	await modulePromise;
}

export async function ensureLibfluxcoreReady(): Promise<void> {
	await loadModule();
}

export function cropAndRotateGif(
	gif: Uint8Array,
	x: number,
	y: number,
	width: number,
	height: number,
	rotation: number,
	resizeWidth: number | null,
	resizeHeight: number | null,
): Uint8Array {
	const result = wasm.crop_and_rotate_gif(gif, x, y, width, height, rotation, resizeWidth, resizeHeight);
	return result instanceof Uint8Array ? result : new Uint8Array(result);
}
