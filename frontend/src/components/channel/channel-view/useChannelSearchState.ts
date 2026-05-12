/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {ChannelRecord} from '~/records/ChannelRecord';
import ChannelSearchStore, {getChannelSearchContextId} from '~/stores/ChannelSearchStore';
import SelectedGuildStore from '~/stores/SelectedGuildStore';
import type {SearchSegment} from '~/utils/SearchSegmentManager';

interface UseChannelSearchStateReturn {
	searchQuery: string;
	searchSegments: Array<SearchSegment>;
	activeSearchQuery: string;
	activeSearchSegments: Array<SearchSegment>;
	isSearchActive: boolean;
	searchRefreshKey: number;
	setIsSearchActive: (value: boolean) => void;
	handleSearchSubmit: (query: string, segments: Array<SearchSegment>) => void;
	handleSearchClose: () => void;
}

export const useChannelSearchState = (channel?: ChannelRecord): UseChannelSearchStateReturn => {
	const selectedGuildId = SelectedGuildStore.selectedGuildId;
	const contextId = React.useMemo(
		() => getChannelSearchContextId(channel ?? null, selectedGuildId),
		[channel?.guildId, channel?.id, selectedGuildId],
	);

	const context = contextId ? ChannelSearchStore.getContext(contextId) : null;

	const handleSearchSubmit = React.useCallback(
		(query: string, segments: Array<SearchSegment>) => {
			if (!contextId) {
				return;
			}
			ChannelSearchStore.setSearchInput(contextId, query, segments);
			ChannelSearchStore.setActiveSearch(contextId, query, segments);
		},
		[contextId],
	);

	const handleSearchClose = React.useCallback(() => {
		if (!contextId) {
			return;
		}
		ChannelSearchStore.closeSearch(contextId);
	}, [contextId]);

	const setIsSearchActive = React.useCallback(
		(value: boolean) => {
			if (!contextId) {
				return;
			}
			ChannelSearchStore.setIsSearchActive(contextId, value);
		},
		[contextId],
	);

	return {
		searchQuery: context?.searchQuery ?? '',
		searchSegments: context?.searchSegments ?? [],
		activeSearchQuery: context?.activeSearchQuery ?? '',
		activeSearchSegments: context?.activeSearchSegments ?? [],
		isSearchActive: context?.isSearchActive ?? false,
		searchRefreshKey: context?.searchRefreshKey ?? 0,
		setIsSearchActive,
		handleSearchSubmit,
		handleSearchClose,
	};
};
