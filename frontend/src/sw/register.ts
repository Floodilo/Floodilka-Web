/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import Config from '~/Config';
import {IS_DEV} from '~/lib/env';

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
	if (!('serviceWorker' in navigator)) {
		return;
	}
	if (IS_DEV) {
		return;
	}
	try {
		const versionParam = Config.PUBLIC_BUILD_SHA || Date.now();
		const swUrl = `/sw.js?v=${versionParam}`;
		const registration = await navigator.serviceWorker.register(swUrl);
		return registration;
	} catch (error) {
		console.error('[SW] Registration failed', error);
		return;
	}
}
