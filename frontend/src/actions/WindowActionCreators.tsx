/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import GuildReadStateStore from '~/stores/GuildReadStateStore';
import NotificationStore from '~/stores/NotificationStore';
import WindowStore from '~/stores/WindowStore';

export const focus = (focused: boolean): void => {
	WindowStore.setFocused(focused);
	GuildReadStateStore.handleWindowFocus();
	NotificationStore.handleWindowFocus({focused});
};

export const resized = (): void => {
	WindowStore.updateWindowSize();
};

export const visibilityChanged = (visible: boolean): void => {
	WindowStore.setVisible(visible);
};
