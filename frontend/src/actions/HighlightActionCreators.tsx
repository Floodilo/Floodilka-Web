/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import AutocompleteStore from '~/stores/AutocompleteStore';

export const highlightChannel = (channelId: string): void => {
	AutocompleteStore.highlightChannel(channelId);
};

export const clearChannelHighlight = (): void => {
	AutocompleteStore.highlightChannelClear();
};
