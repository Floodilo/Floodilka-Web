/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import DimensionStore from '~/stores/DimensionStore';

const logger = new Logger('DimensionActions');

type GuildId = string;

export const updateChannelListScroll = (guildId: GuildId, scrollTop: number): void => {
	logger.debug(`Updating channel list scroll: guildId=${guildId}, scrollTop=${scrollTop}`);
	DimensionStore.updateGuildDimensions(guildId, scrollTop, undefined);
};

export const clearChannelListScrollTo = (guildId: GuildId): void => {
	logger.debug(`Clearing channel list scroll target: guildId=${guildId}`);
	DimensionStore.updateGuildDimensions(guildId, undefined, null);
};

export const updateGuildListScroll = (scrollTop: number): void => {
	logger.debug(`Updating guild list scroll: scrollTop=${scrollTop}`);
	DimensionStore.updateGuildListDimensions(scrollTop);
};
