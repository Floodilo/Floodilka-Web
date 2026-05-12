/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback, useEffect, useState} from 'react';
import VoiceDevicePermissionStore, {type VoiceDeviceState} from '~/stores/voice/VoiceDevicePermissionStore';

interface UseMediaDevicesOptions {
	requestPermissions?: boolean;
	autoRefresh?: boolean;
}

interface RefreshOptions {
	requestPermissions?: boolean;
}

type UseMediaDevicesResult = VoiceDeviceState & {
	refreshDevices: (options?: RefreshOptions) => Promise<void>;
};

export const useMediaDevices = (options: UseMediaDevicesOptions = {}): UseMediaDevicesResult => {
	const {requestPermissions = false, autoRefresh = true} = options;
	const [state, setState] = useState<VoiceDeviceState>(() => VoiceDevicePermissionStore.getState());

	useEffect(() => VoiceDevicePermissionStore.subscribe(setState), []);

	useEffect(() => {
		if (!autoRefresh) return;
		void VoiceDevicePermissionStore.ensureDevices({requestPermissions}).catch(() => {});
	}, [autoRefresh, requestPermissions]);

	const refreshDevices = useCallback(
		async (refreshOptions?: RefreshOptions) => {
			await VoiceDevicePermissionStore.ensureDevices({
				requestPermissions: refreshOptions?.requestPermissions ?? requestPermissions,
			});
		},
		[requestPermissions],
	);

	return {
		...state,
		refreshDevices,
	};
};
