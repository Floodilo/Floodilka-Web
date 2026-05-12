/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {SettingsTab} from './settingsConstants';
import {getMatchedTabTypes, type SettingsSearchResult, searchSettings} from './settingsSearchIndex';

const STAFF_ONLY_CATEGORY = 'staff_only';

export interface FilteredSettingsResult {
	groupedTabs: Record<string, Array<SettingsTab>>;
	searchResults: Array<SettingsSearchResult>;
}

export const filterSettingsTabsForDeveloperMode = (
	groupedTabs: Record<string, Array<SettingsTab>>,
	isDeveloper: boolean,
) => {
	if (isDeveloper) {
		return groupedTabs;
	}

	const filtered: Record<string, Array<SettingsTab>> = {};
	Object.entries(groupedTabs).forEach(([category, tabs]) => {
		if (category === STAFF_ONLY_CATEGORY) {
			return;
		}
		filtered[category] = tabs;
	});

	return filtered;
};

export const filterSettingsTabsByQuery = (
	groupedTabs: Record<string, Array<SettingsTab>>,
	query: string,
): FilteredSettingsResult => {
	const trimmedQuery = query.trim();
	if (trimmedQuery.length === 0) {
		return {groupedTabs, searchResults: []};
	}

	const allTabs = Object.values(groupedTabs).flat();
	const searchResults = searchSettings(trimmedQuery, allTabs);
	const matchedTabTypes = getMatchedTabTypes(searchResults);

	const filtered: Record<string, Array<SettingsTab>> = {};

	Object.entries(groupedTabs).forEach(([category, tabs]) => {
		const matchedTabs = tabs.filter((tab) => matchedTabTypes.has(tab.type));

		if (matchedTabs.length > 0) {
			filtered[category] = matchedTabs;
		}
	});

	return {groupedTabs: filtered, searchResults};
};
