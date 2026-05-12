/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import AccessibilityStore, {type AccessibilitySettings} from '~/stores/AccessibilityStore';

export const update = (settings: Partial<AccessibilitySettings>): void => {
	AccessibilityStore.updateSettings(settings);
};
