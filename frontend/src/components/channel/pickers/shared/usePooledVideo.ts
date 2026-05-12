/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as React from 'react';

export interface GifVideoPoolLike {
	getElement: (key: string) => HTMLVideoElement;
	getBlobUrl: (key: string) => Promise<string>;
	registerActive: (video: HTMLVideoElement) => void;
	unregisterActive: (video: HTMLVideoElement) => void;
	poolElement: (video: HTMLVideoElement, key: string) => void;
}

export function usePooledVideo({
	src,
	containerRef,
	videoPool,
	autoPlay,
	enabled = true,
}: {
	src: string | null | undefined;
	containerRef: React.RefObject<HTMLDivElement | null>;
	videoPool: GifVideoPoolLike;
	autoPlay: boolean;
	enabled?: boolean;
}) {
	const videoRef = React.useRef<HTMLVideoElement | null>(null);

	React.useEffect(() => {
		if (!enabled) return;
		if (!src) return;

		const container = containerRef.current;
		if (!container) return;

		let cancelled = false;
		let attached = false;

		const video = videoPool.getElement(src);
		videoRef.current = video;

		const run = async () => {
			try {
				const blobUrl = await videoPool.getBlobUrl(src);
				if (cancelled) return;
				if (video.src !== blobUrl) video.src = blobUrl;
			} catch {
				if (cancelled) return;
				if (video.src !== src) video.src = src;
			}

			if (cancelled) return;

			const currentContainer = containerRef.current;
			if (!currentContainer) return;

			currentContainer.appendChild(video);
			attached = true;
			videoPool.registerActive(video);

			if (!autoPlay) {
				video.pause();
			}
		};

		void run();

		return () => {
			cancelled = true;

			if (attached) {
				videoPool.unregisterActive(video);
			}

			try {
				video.pause();
				video.currentTime = 0;
			} catch {}

			videoPool.poolElement(video, src);

			if (videoRef.current === video) {
				videoRef.current = null;
			}
		};
	}, [src, enabled, containerRef, videoPool, autoPlay]);

	return videoRef;
}
