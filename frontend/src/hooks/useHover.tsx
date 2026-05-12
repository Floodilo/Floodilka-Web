/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';

type HoverHook = [React.RefCallback<HTMLElement>, boolean];

export const useHover = (delay = 0): HoverHook => {
	const [hovering, setHovering] = React.useState(false);
	const previousNode = React.useRef<HTMLElement | null>(null);
	const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = React.useCallback(() => {
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
		timeoutId.current = setTimeout(() => {
			setHovering(true);
		}, delay);
	}, [delay]);

	const handleMouseLeave = React.useCallback(() => {
		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
		setHovering(false);
	}, []);

	const customRef = React.useCallback(
		(node: HTMLElement | null) => {
			if (previousNode.current) {
				previousNode.current.removeEventListener('mouseenter', handleMouseEnter);
				previousNode.current.removeEventListener('mouseleave', handleMouseLeave);
			}

			if (node) {
				node.addEventListener('mouseenter', handleMouseEnter);
				node.addEventListener('mouseleave', handleMouseLeave);
			}

			previousNode.current = node;
		},
		[handleMouseEnter, handleMouseLeave],
	);

	return [customRef, hovering];
};
