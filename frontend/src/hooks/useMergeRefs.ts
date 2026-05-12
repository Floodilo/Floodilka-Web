/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as React from 'react';

export const useMergeRefs = <T>(
	refs: Array<React.MutableRefObject<T | null> | React.LegacyRef<T> | undefined | null>,
): React.RefCallback<T> => {
	const latestRefs = React.useRef(refs);
	latestRefs.current = refs;

	return React.useCallback((value: T | null) => {
		for (const ref of latestRefs.current) {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref != null) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		}
	}, []);
};
