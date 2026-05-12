/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as React from 'react';
import type {ScrollerHandle} from '~/components/uikit/Scroller';

type ResizeType = 'container' | 'content';

export function useScrollerViewport(scrollerRef: React.RefObject<ScrollerHandle | null>) {
	const [viewportSize, setViewportSize] = React.useState({width: 0, height: 0});
	const [scrollTop, setScrollTop] = React.useState(0);

	const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(event.currentTarget.scrollTop);
	}, []);

	const handleResize = React.useCallback((entry: ResizeObserverEntry, type: ResizeType) => {
		if (type !== 'container') return;
		const {width, height} = entry.contentRect;

		setViewportSize((prev) => {
			if (prev.width === width && prev.height === height) return prev;
			return {width, height};
		});
	}, []);

	React.useLayoutEffect(() => {
		if (viewportSize.width > 0 && viewportSize.height > 0) return;

		const node = scrollerRef.current?.getScrollerNode();
		if (!node) return;

		const rect = node.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;

		setViewportSize({width: rect.width, height: rect.height});
	}, [scrollerRef, viewportSize.width, viewportSize.height]);

	const scrollToTop = React.useCallback(() => {
		scrollerRef.current?.scrollTo({to: 0, animate: false});
		setScrollTop(0);
	}, [scrollerRef]);

	return {
		viewportSize,
		scrollTop,
		setScrollTop,
		handleScroll,
		handleResize,
		scrollToTop,
	};
}
