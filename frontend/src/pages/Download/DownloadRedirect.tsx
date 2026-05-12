/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect} from 'react';

const APP_STORE_URL = 'https://apps.apple.com/app/id6755156241';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.floodilka.android';

export const DownloadRedirect = () => {
	useEffect(() => {
		const ua = navigator.userAgent;

		if (/iPhone|iPad|iPod/.test(ua)) {
			window.location.href = APP_STORE_URL;
		} else if (/Android/.test(ua)) {
			window.location.href = GOOGLE_PLAY_URL;
		} else {
			window.location.href = '/download';
		}
	}, []);

	return null;
};
