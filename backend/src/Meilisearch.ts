/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MeiliSearch} from 'meilisearch';
import {Config} from './Config';
import {Logger} from './Logger';
import {AuditLogSearchService} from './search/AuditLogSearchService';
import {GuildSearchService} from './search/GuildSearchService';
import {MessageSearchService} from './search/MessageSearchService';
import {ReportSearchService} from './search/ReportSearchService';
import {UserSearchService} from './search/UserSearchService';

let meilisearchClient: MeiliSearch | null = null;
let messageSearchService: MessageSearchService | null = null;
let guildSearchService: GuildSearchService | null = null;
let userSearchService: UserSearchService | null = null;
let reportSearchService: ReportSearchService | null = null;
let auditLogSearchService: AuditLogSearchService | null = null;

function getMeilisearchClient(): MeiliSearch | null {
	if (!Config.search.enabled) {
		return null;
	}

	if (!meilisearchClient) {
		if (!Config.search.url || !Config.search.apiKey) {
			throw new Error('Meilisearch URL and API key are required when search is enabled');
		}

		meilisearchClient = new MeiliSearch({
			host: Config.search.url,
			apiKey: Config.search.apiKey,
		});
	}

	return meilisearchClient;
}

export function getMessageSearchService(): MessageSearchService | null {
	if (!Config.search.enabled) {
		return null;
	}

	const client = getMeilisearchClient();
	if (!client) {
		return null;
	}

	if (!messageSearchService) {
		messageSearchService = new MessageSearchService(client);
	}

	return messageSearchService;
}

export function getGuildSearchService(): GuildSearchService | null {
	if (!Config.search.enabled) {
		return null;
	}

	const client = getMeilisearchClient();
	if (!client) {
		return null;
	}

	if (!guildSearchService) {
		guildSearchService = new GuildSearchService(client);
	}

	return guildSearchService;
}

export function getUserSearchService(): UserSearchService | null {
	if (!Config.search.enabled) {
		return null;
	}

	const client = getMeilisearchClient();
	if (!client) {
		return null;
	}

	if (!userSearchService) {
		userSearchService = new UserSearchService(client);
	}

	return userSearchService;
}

export function getReportSearchService(): ReportSearchService | null {
	if (!Config.search.enabled) {
		return null;
	}

	const client = getMeilisearchClient();
	if (!client) {
		return null;
	}

	if (!reportSearchService) {
		reportSearchService = new ReportSearchService(client);
	}

	return reportSearchService;
}

export function getAuditLogSearchService(): AuditLogSearchService | null {
	if (!Config.search.enabled) {
		return null;
	}

	const client = getMeilisearchClient();
	if (!client) {
		return null;
	}

	if (!auditLogSearchService) {
		auditLogSearchService = new AuditLogSearchService(client);
	}

	return auditLogSearchService;
}

export async function initializeMeilisearch(): Promise<void> {
	if (!Config.search.enabled) {
		Logger.info('Search is disabled, skipping Meilisearch initialization');
		return;
	}

	const messageSearch = getMessageSearchService();
	const guildSearch = getGuildSearchService();
	const userSearch = getUserSearchService();
	const reportSearch = getReportSearchService();
	const auditLogSearch = getAuditLogSearchService();

	await Promise.all([
		messageSearch?.initialize(),
		guildSearch?.initialize(),
		userSearch?.initialize(),
		reportSearch?.initialize(),
		auditLogSearch?.initialize(),
	]);

	Logger.info('Meilisearch initialized successfully');
}
