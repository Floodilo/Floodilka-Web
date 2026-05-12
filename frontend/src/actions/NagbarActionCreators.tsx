/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import NagbarStore, {type NagbarToggleKey} from '~/stores/NagbarStore';

export const dismissNagbar = (nagbarType: NagbarToggleKey): void => {
	NagbarStore.dismiss(nagbarType);
};

export const dismissInvitesDisabledNagbar = (guildId: string): void => {
	NagbarStore.dismissInvitesDisabled(guildId);
};

export const resetNagbar = (nagbarType: NagbarToggleKey): void => {
	NagbarStore.reset(nagbarType);
};

export const resetAllNagbars = (): void => {
	NagbarStore.resetAll();
};

export const setForceHideNagbar = (key: NagbarToggleKey, value: boolean): void => {
	NagbarStore.setFlag(key, value);
};

export const dismissPendingBulkDeletionNagbar = (scheduleKey: string): void => {
	NagbarStore.dismissPendingBulkDeletion(scheduleKey);
};

export const clearPendingBulkDeletionNagbarDismissal = (scheduleKey: string): void => {
	NagbarStore.clearPendingBulkDeletionDismissed(scheduleKey);
};
