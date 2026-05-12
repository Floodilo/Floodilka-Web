/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {getElectronAPI, isNativeMacOS} from '~/utils/NativeUtils';

type PermissionKind = 'microphone' | 'camera' | 'screen' | 'accessibility' | 'input-monitoring';

export type NativePermissionResult = 'granted' | 'denied' | 'not-determined' | 'unsupported';

const permissionCache = new Map<
	PermissionKind,
	{
		value: NativePermissionResult;
		timestamp: number;
	}
>();

const CACHE_DURATION = 1000;

export const getCachedPermission = (kind: PermissionKind): NativePermissionResult | null => {
	const cached = permissionCache.get(kind);
	if (!cached) return null;

	const age = Date.now() - cached.timestamp;
	if (age > CACHE_DURATION) {
		permissionCache.delete(kind);
		return null;
	}

	return cached.value;
};

const setCachedPermission = (kind: PermissionKind, value: NativePermissionResult): void => {
	permissionCache.set(kind, {value, timestamp: Date.now()});
};

export const checkNativePermission = async (kind: PermissionKind): Promise<NativePermissionResult> => {
	const electronApi = getElectronAPI();
	if (!electronApi) {
		const result = 'unsupported';
		setCachedPermission(kind, result);
		return result;
	}

	if (!isNativeMacOS()) {
		const result = 'granted';
		setCachedPermission(kind, result);
		return result;
	}

	let result: NativePermissionResult;

	if (kind === 'input-monitoring') {
		const hasAccess = await electronApi.checkInputMonitoringAccess();
		result = hasAccess ? 'granted' : 'denied';
		setCachedPermission(kind, result);
		return result;
	}

	if (kind === 'accessibility') {
		const isTrusted = await electronApi.checkAccessibility(false);
		result = isTrusted ? 'granted' : 'denied';
		setCachedPermission(kind, result);
		return result;
	}

	const status = await electronApi.checkMediaAccess(kind);
	switch (status) {
		case 'granted':
			result = 'granted';
			break;
		case 'denied':
		case 'restricted':
			result = 'denied';
			break;
		case 'not-determined':
			result = 'not-determined';
			break;
		default:
			result = 'not-determined';
			break;
	}

	setCachedPermission(kind, result);
	return result;
};

export const requestNativePermission = async (kind: PermissionKind): Promise<NativePermissionResult> => {
	const electronApi = getElectronAPI();
	if (!electronApi) return 'unsupported';

	if (!isNativeMacOS()) {
		return 'granted';
	}

	if (kind === 'input-monitoring') {
		const hasAccess = await electronApi.checkInputMonitoringAccess();
		return hasAccess ? 'granted' : 'denied';
	}

	if (kind === 'accessibility') {
		const isTrusted = await electronApi.checkAccessibility(true);
		return isTrusted ? 'granted' : 'denied';
	}

	const granted = await electronApi.requestMediaAccess(kind);
	return granted ? 'granted' : 'denied';
};

export const ensureNativePermission = async (kind: PermissionKind): Promise<NativePermissionResult> => {
	const current = await checkNativePermission(kind);

	if (current === 'granted' || current === 'unsupported') {
		return current;
	}

	if (current === 'not-determined') {
		return requestNativePermission(kind);
	}

	return 'denied';
};

export const openNativePermissionSettings = async (kind: PermissionKind): Promise<void> => {
	const electronApi = getElectronAPI();
	if (!electronApi) return;

	if (!isNativeMacOS()) {
		return;
	}

	switch (kind) {
		case 'accessibility':
			await electronApi.openAccessibilitySettings();
			break;
		case 'input-monitoring':
			await electronApi.openInputMonitoringSettings();
			break;
		case 'microphone':
		case 'camera':
		case 'screen':
			await electronApi.openMediaAccessSettings(kind);
			break;
	}
};
