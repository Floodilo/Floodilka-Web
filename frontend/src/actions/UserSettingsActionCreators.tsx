/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserSettings} from '~/stores/UserSettingsStore';
import UserSettingsStore from '~/stores/UserSettingsStore';

export const update = async (settings: Partial<UserSettings>): Promise<void> => {
	await UserSettingsStore.saveSettings(settings);
};
