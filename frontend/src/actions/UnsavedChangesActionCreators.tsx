/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import UnsavedChangesStore from '~/stores/UnsavedChangesStore';

export const setUnsavedChanges = (tabId: string, hasChanges: boolean): void => {
	UnsavedChangesStore.setUnsavedChanges(tabId, hasChanges);
};

export const triggerFlashEffect = (tabId: string): void => {
	UnsavedChangesStore.triggerFlash(tabId);
};

export const clearUnsavedChanges = (tabId: string): void => {
	UnsavedChangesStore.clearUnsavedChanges(tabId);
};

export const setTabData = (
	tabId: string,
	data: {onReset?: () => void; onSave?: () => void; isSubmitting?: boolean},
): void => {
	UnsavedChangesStore.setTabData(tabId, data);
};
