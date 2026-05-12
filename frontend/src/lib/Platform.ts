/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const userAgent = navigator.userAgent;
const hasNavigator = typeof navigator !== 'undefined';

const isIOSDevice = (() => {
	if (/iPhone|iPad|iPod/.test(userAgent)) return true;
	if (/Mac/.test(userAgent) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1) {
		return true;
	}
	return false;
})();

const isAndroidDevice = /Android/.test(userAgent);
const isMobileBrowser = isIOSDevice || isAndroidDevice;
const isIOSWeb = isIOSDevice;
const isElectron = typeof (window as {electron?: unknown}).electron !== 'undefined';
const isPWA = typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;

type PlatformSpecifics<T> = Partial<Record<string, T | undefined>> & {
	default?: T | undefined;
};

const selectValue = <T>(specifics: PlatformSpecifics<T>): T | undefined => {
	if (isElectron && specifics.electron !== undefined) {
		return specifics.electron;
	}
	if (specifics.web !== undefined) {
		return specifics.web;
	}
	if (specifics.default !== undefined) {
		return specifics.default;
	}
	return Object.values(specifics).find((value) => value !== undefined);
};

export const Platform = {
	OS: 'web' as const,
	isWeb: true,
	isIOS: isIOSDevice,
	isAndroid: isAndroidDevice,
	isElectron,
	isIOSWeb,
	isPWA,
	isAppleDevice: isIOSDevice,
	isMobileBrowser,
	select: selectValue,
};

export function isWebPlatform(): boolean {
	return Platform.isWeb;
}

export function isElectronPlatform(): boolean {
	return Platform.isElectron;
}

export function getNativeLocaleIdentifier(): string | null {
	if (!hasNavigator) {
		return null;
	}
	const languages = navigator.languages;
	if (Array.isArray(languages) && languages.length > 0) {
		return languages[0];
	}
	return navigator.language ?? null;
}
