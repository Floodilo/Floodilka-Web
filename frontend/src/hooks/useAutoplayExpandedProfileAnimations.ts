/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import AccessibilityStore from '~/stores/AccessibilityStore';
import WindowStore from '~/stores/WindowStore';

export const useAutoplayExpandedProfileAnimations = (): boolean => {
	const windowFocused = WindowStore.focused;
	const windowVisible = WindowStore.visible;
	const prefersReducedMotion = AccessibilityStore.useReducedMotion;

	return windowFocused && windowVisible && !prefersReducedMotion;
};
