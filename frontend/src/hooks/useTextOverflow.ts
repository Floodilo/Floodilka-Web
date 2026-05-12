/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';

export const useTextOverflow = (ref: React.RefObject<HTMLElement | null>) => {
	const [isOverflowing, setIsOverflowing] = React.useState(false);

	React.useEffect(() => {
		const el = ref.current;
		if (!el) {
			setIsOverflowing(false);
			return;
		}

		const checkOverflow = () => {
			const {scrollWidth, clientWidth} = el;
			setIsOverflowing(scrollWidth - clientWidth > 1);
		};

		checkOverflow();

		const resizeObserver = new ResizeObserver(checkOverflow);
		resizeObserver.observe(el);

		return () => {
			resizeObserver.disconnect();
		};
	}, [ref]);

	return isOverflowing;
};
