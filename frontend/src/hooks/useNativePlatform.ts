/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import {
	getNativePlatform,
	guessPlatform,
	isDesktop,
	isNativeLinux,
	isNativeMacOS,
	isNativeWindows,
	type NativePlatform,
} from '~/utils/NativeUtils';

export interface NativePlatformState {
	platform: NativePlatform;
	isNative: boolean;
	isMacOS: boolean;
	isWindows: boolean;
	isLinux: boolean;
}

export const useNativePlatform = (): NativePlatformState => {
	const [platform, setPlatform] = React.useState<NativePlatform>(guessPlatform());
	const platformOverride = DeveloperOptionsStore.mockTitlebarPlatformOverride;
	const hasOverride = platformOverride !== 'auto';
	const isNative = isDesktop() || hasOverride;

	React.useEffect(() => {
		if (!isNative) return;
		let cancelled = false;
		void getNativePlatform().then((value) => {
			if (!cancelled && value) {
				setPlatform(value);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [isNative]);

	const effectivePlatform = hasOverride ? platformOverride : platform;

	return {
		platform: effectivePlatform,
		isNative,
		isMacOS: isNative && isNativeMacOS(effectivePlatform),
		isWindows: isNative && isNativeWindows(effectivePlatform),
		isLinux: isNative && isNativeLinux(effectivePlatform),
	};
};
