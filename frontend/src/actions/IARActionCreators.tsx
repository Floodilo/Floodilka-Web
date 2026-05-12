/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';

const logger = new Logger('IAR');

export const reportMessage = async (
	channelId: string,
	messageId: string,
	category: string,
	additionalInfo?: string,
): Promise<void> => {
	try {
		logger.debug(`Reporting message ${messageId} in channel ${channelId}`);
		await http.post({
			url: Endpoints.REPORT_MESSAGE,
			body: {
				channel_id: channelId,
				message_id: messageId,
				category,
				additional_info: additionalInfo || undefined,
			},
		});
		logger.info('Message report submitted successfully');
	} catch (error) {
		logger.error('Failed to submit message report:', error);
		throw error;
	}
};

export const reportUser = async (
	userId: string,
	category: string,
	additionalInfo?: string,
	guildId?: string,
): Promise<void> => {
	try {
		logger.debug(`Reporting user ${userId}${guildId ? ` in guild ${guildId}` : ''}`);
		await http.post({
			url: Endpoints.REPORT_USER,
			body: {
				user_id: userId,
				category,
				additional_info: additionalInfo || undefined,
				guild_id: guildId || undefined,
			},
		});
		logger.info('User report submitted successfully');
	} catch (error) {
		logger.error('Failed to submit user report:', error);
		throw error;
	}
};

export const reportGuild = async (guildId: string, category: string, additionalInfo?: string): Promise<void> => {
	try {
		logger.debug(`Reporting guild ${guildId}`);
		await http.post({
			url: Endpoints.REPORT_GUILD,
			body: {
				guild_id: guildId,
				category,
				additional_info: additionalInfo || undefined,
			},
		});
		logger.info('Guild report submitted successfully');
	} catch (error) {
		logger.error('Failed to submit guild report:', error);
		throw error;
	}
};
