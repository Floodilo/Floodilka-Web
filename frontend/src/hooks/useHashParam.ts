/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect, useState} from 'react';

export function useHashParam(paramName: string): string | null {
	const [value, setValue] = useState<string | null>(() => {
		const hash = window.location.hash;
		if (hash?.startsWith(`#${paramName}=`)) {
			return hash.substring(`#${paramName}=`.length);
		}
		return null;
	});

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash;
			if (hash?.startsWith(`#${paramName}=`)) {
				setValue(hash.substring(`#${paramName}=`.length));
			} else {
				setValue(null);
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, [paramName]);

	return value;
}
