/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import UserSettingsStore from '~/stores/UserSettingsStore';

const DEFAULT_LOCALE = 'ru';

export const getCurrentLocale = (): string => {
	return UserSettingsStore.getLocale() || DEFAULT_LOCALE;
};
