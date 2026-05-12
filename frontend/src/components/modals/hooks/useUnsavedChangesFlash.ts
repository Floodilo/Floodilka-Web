/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import * as UnsavedChangesActionCreators from '~/actions/UnsavedChangesActionCreators';
import UnsavedChangesStore from '~/stores/UnsavedChangesStore';

export function useUnsavedChangesFlash(selectedTab: string | null) {
	const unsavedChangesStore = UnsavedChangesStore;

	const [flashBanner, setFlashBanner] = React.useState(false);
	const [lastFlashTrigger, setLastFlashTrigger] = React.useState(0);

	const currentTabId = selectedTab || '';
	const showUnsavedBanner = unsavedChangesStore.unsavedChanges[currentTabId] || false;
	const flashTrigger = unsavedChangesStore.flashTriggers[currentTabId] || 0;
	const tabData = unsavedChangesStore.tabData[currentTabId] || {};

	React.useEffect(() => {
		if (flashTrigger > lastFlashTrigger) {
			setFlashBanner(true);
			setLastFlashTrigger(flashTrigger);
			setTimeout(() => setFlashBanner(false), 300);
		}
	}, [flashTrigger, lastFlashTrigger]);

	const checkUnsavedChanges = React.useCallback(
		(tabId?: string): boolean => {
			const checkTabId = tabId || selectedTab;
			if (!checkTabId) return false;

			if (unsavedChangesStore.unsavedChanges[checkTabId]) {
				UnsavedChangesActionCreators.triggerFlashEffect(checkTabId);
				return true;
			}
			return false;
		},
		[selectedTab, unsavedChangesStore.unsavedChanges],
	);

	return {
		showUnsavedBanner,
		flashBanner,
		tabData,
		checkUnsavedChanges,
	};
}
