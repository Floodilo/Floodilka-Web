/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import MessageStore from '~/stores/MessageStore';
import NotificationStore from '~/stores/NotificationStore';
import SelectedChannelStore from '~/stores/SelectedChannelStore';
import SelectedGuildStore from '~/stores/SelectedGuildStore';

const logger = new Logger('Navigation');

export const selectChannel = (guildId?: string, channelId?: string | null, messageId?: string): void => {
	logger.debug(`Selecting channel: guildId=${guildId}, channelId=${channelId}, messageId=${messageId}`);
	MessageStore.handleChannelSelect({guildId, channelId, messageId});
	NotificationStore.handleChannelSelect({channelId});
	SelectedChannelStore.selectChannel(guildId, channelId);
};

export const selectGuild = (guildId: string): void => {
	logger.debug(`Selecting guild: ${guildId}`);
	SelectedGuildStore.selectGuild(guildId);
};

export const deselectGuild = (): void => {
	logger.debug('Deselecting guild');
	SelectedGuildStore.deselectGuild();
};
