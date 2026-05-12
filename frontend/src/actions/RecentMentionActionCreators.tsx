/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {Message} from '~/records/MessageRecord';
import type {MentionFilters} from '~/stores/RecentMentionsStore';
import RecentMentionsStore from '~/stores/RecentMentionsStore';

const logger = new Logger('Mentions');

export const fetch = async (): Promise<Array<Message>> => {
	RecentMentionsStore.handleFetchPending();
	try {
		const filters = RecentMentionsStore.getFilters();
		logger.debug('Fetching recent mentions');
		const response = await http.get<Array<Message>>({
			url: Endpoints.USER_MENTIONS,
			query: {
				everyone: filters.includeEveryone,
				roles: filters.includeRoles,
				guilds: filters.includeGuilds,
				limit: 25,
			},
		});
		const data = response.body ?? [];
		RecentMentionsStore.handleRecentMentionsFetchSuccess(data);
		logger.debug(`Successfully fetched ${data.length} recent mentions`);
		return data;
	} catch (error) {
		RecentMentionsStore.handleRecentMentionsFetchError();
		logger.error('Failed to fetch recent mentions:', error);
		throw error;
	}
};

export const loadMore = async (): Promise<Array<Message>> => {
	const recentMentions = RecentMentionsStore.recentMentions;
	if (recentMentions.length === 0) {
		return [];
	}

	const lastMessage = recentMentions[recentMentions.length - 1];
	const filters = RecentMentionsStore.getFilters();

	RecentMentionsStore.handleFetchPending();
	try {
		logger.debug(`Loading more mentions before ${lastMessage.id}`);
		const response = await http.get<Array<Message>>({
			url: Endpoints.USER_MENTIONS,
			query: {
				everyone: filters.includeEveryone,
				roles: filters.includeRoles,
				guilds: filters.includeGuilds,
				limit: 25,
				before: lastMessage.id,
			},
		});
		const data = response.body ?? [];
		RecentMentionsStore.handleRecentMentionsFetchSuccess(data);
		logger.debug(`Successfully loaded ${data.length} more mentions`);
		return data;
	} catch (error) {
		RecentMentionsStore.handleRecentMentionsFetchError();
		logger.error('Failed to load more mentions:', error);
		throw error;
	}
};

export const updateFilters = (filters: Partial<MentionFilters>): void => {
	RecentMentionsStore.updateFilters(filters);
};

export const remove = async (messageId: string): Promise<void> => {
	try {
		RecentMentionsStore.handleMessageDelete(messageId);
		logger.debug(`Removing message ${messageId} from recent mentions`);
		await http.delete({url: Endpoints.USER_MENTION(messageId)});
		logger.debug(`Successfully removed message ${messageId} from recent mentions`);
	} catch (error) {
		logger.error(`Failed to remove message ${messageId} from recent mentions:`, error);
		throw error;
	}
};
