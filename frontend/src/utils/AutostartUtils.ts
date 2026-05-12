/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {getElectronAPI} from './NativeUtils';

export const setAutostartEnabled = async (enabled: boolean): Promise<boolean | null> => {
	const electronApi = getElectronAPI();
	if (!electronApi) return null;

	try {
		if (enabled) {
			await electronApi.autostartEnable();
		} else {
			await electronApi.autostartDisable();
		}
		return await electronApi.autostartIsEnabled();
	} catch (error) {
		console.error('Failed to update autostart status', error);
		return null;
	}
};

export const getAutostartStatus = async (): Promise<boolean | null> => {
	const electronApi = getElectronAPI();
	if (!electronApi) return null;

	try {
		return await electronApi.autostartIsEnabled();
	} catch (error) {
		console.error('Failed to read autostart status', error);
		return null;
	}
};

export const ensureAutostartDefaultEnabled = async (): Promise<boolean | null> => {
	const electronApi = getElectronAPI();
	if (!electronApi) return null;

	try {
		if (electronApi.platform !== 'darwin') {
			return await electronApi.autostartIsEnabled();
		}

		const initialized = await electronApi.autostartIsInitialized();
		let enabled = await electronApi.autostartIsEnabled();

		if (!initialized && !enabled) {
			await electronApi.autostartEnable();
			enabled = await electronApi.autostartIsEnabled();
		}

		if (!initialized) {
			await electronApi.autostartMarkInitialized();
		}

		return enabled;
	} catch (error) {
		console.error('Failed to ensure default autostart', error);
		return null;
	}
};
