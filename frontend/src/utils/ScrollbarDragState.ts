/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const SCROLLER_DRAG_ATTR = 'data-scroller-dragging';

let activeDrags = 0;
let pendingClear: number | null = null;

const getRoot = () => document.documentElement;

const updateAttribute = (isDragging: boolean) => {
	const root = getRoot();

	if (isDragging) {
		root.setAttribute(SCROLLER_DRAG_ATTR, 'true');
	} else {
		root.removeAttribute(SCROLLER_DRAG_ATTR);
	}
};

const clearPendingTimeout = () => {
	if (pendingClear !== null) {
		window.clearTimeout(pendingClear);
		pendingClear = null;
	}
};

const decrementDragCount = () => {
	activeDrags = Math.max(0, activeDrags - 1);
	if (activeDrags === 0) {
		updateAttribute(false);
	}
};

export const beginScrollbarDrag = () => {
	clearPendingTimeout();
	activeDrags += 1;
	updateAttribute(true);
};

export const endScrollbarDrag = () => {
	clearPendingTimeout();
	decrementDragCount();
};

export const endScrollbarDragDeferred = () => {
	clearPendingTimeout();

	pendingClear = window.setTimeout(() => {
		pendingClear = null;
		decrementDragCount();
	}, 0);
};

export const isScrollbarDragActive = () => activeDrags > 0;
