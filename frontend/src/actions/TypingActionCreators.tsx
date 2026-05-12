/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import TypingStore from '~/stores/TypingStore';

const logger = new Logger('Typing');

export const sendTyping = async (channelId: string): Promise<void> => {
	try {
		logger.debug(`Sending typing indicator to channel ${channelId}`);
		await http.post({url: Endpoints.CHANNEL_TYPING(channelId)});
		logger.debug(`Successfully sent typing indicator to channel ${channelId}`);
	} catch (error) {
		logger.error(`Failed to send typing indicator to channel ${channelId}:`, error);
	}
};

export const startTyping = (channelId: string, userId: string): void => {
	logger.debug(`Starting typing indicator for user ${userId} in channel ${channelId}`);
	TypingStore.startTyping(channelId, userId);
};

export const stopTyping = (channelId: string, userId: string): void => {
	logger.debug(`Stopping typing indicator for user ${userId} in channel ${channelId}`);
	TypingStore.stopTyping(channelId, userId);
};
