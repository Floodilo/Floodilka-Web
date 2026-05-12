/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

declare module 'favico.js' {
	export interface FavicoOptions {
		animation?: string;
		bgColor?: string;
		textColor?: string;
		fontFamily?: string;
		fontStyle?: string;
		type?: string;
		position?: string;
		element?: HTMLElement;
		elementId?: string;
		dataUrl?: (url: string) => void;
	}

	export default class Favico {
		constructor(options?: FavicoOptions);
		badge(count: number | string): void;
		reset(): void;
		image(image: HTMLImageElement | HTMLCanvasElement): void;
		video(video: HTMLVideoElement): void;
		webcam(): void;
	}
}
