/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {isElectron} from '~/utils/NativeUtils';

export function isStandalonePwa(): boolean {
	const matchDisplayMode = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
	const navigatorStandalone = (window.navigator as unknown as {standalone?: boolean})?.standalone === true;
	const androidReferrer = document.referrer.includes('android-app://');

	return matchDisplayMode || navigatorStandalone || androidReferrer;
}

export function isMobileOrTablet(): boolean {
	return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isPwaOnMobileOrTablet(): boolean {
	return isStandalonePwa() && isMobileOrTablet();
}

export function isInstalledPwa(): boolean {
	return isStandalonePwa() && !isElectron();
}
