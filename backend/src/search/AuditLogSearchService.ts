/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Index, MeiliSearch} from 'meilisearch';
import type {AdminAuditLog} from '~/admin/IAdminRepository';
import {Logger} from '~/Logger';
import {SEARCH_MAX_TOTAL_HITS} from '~/search/constants';
import {extractTimestamp} from '~/utils/SnowflakeUtils';

const AUDIT_LOG_INDEX_NAME = 'audit_logs';

interface SearchableAuditLog {
	logId: string;
	adminUserId: string;
	targetType: string;
	targetId: string;
	action: string;
	auditLogReason: string | null;
	createdAt: number;
}

interface AuditLogSearchFilters {
	adminUserId?: string;
	targetType?: string;
	targetId?: string;
	action?: string;
	sortBy?: 'createdAt' | 'relevance';
	sortOrder?: 'asc' | 'desc';
}

export class AuditLogSearchService {
	private meilisearch: MeiliSearch;
	private index: Index<SearchableAuditLog> | null = null;

	constructor(meilisearch: MeiliSearch) {
		this.meilisearch = meilisearch;
	}

	async initialize(): Promise<void> {
		try {
			this.index = this.meilisearch.index<SearchableAuditLog>(AUDIT_LOG_INDEX_NAME);

			await this.index.updateSettings({
				searchableAttributes: ['action', 'auditLogReason', 'targetType', 'adminUserId', 'targetId'],
				filterableAttributes: ['adminUserId', 'targetType', 'targetId', 'action', 'createdAt'],
				sortableAttributes: ['createdAt'],
				rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
				pagination: {
					maxTotalHits: SEARCH_MAX_TOTAL_HITS,
				},
			});

			Logger.debug('Audit log search index initialized successfully');
		} catch (error) {
			Logger.error({error}, 'Failed to initialize audit log search index');
			throw error;
		}
	}

	async indexAuditLog(log: AdminAuditLog): Promise<void> {
		if (!this.index) {
			throw new Error('Audit log search index not initialized');
		}

		const searchableLog = this.convertToSearchableAuditLog(log);

		try {
			await this.index.addDocuments([searchableLog], {primaryKey: 'logId'});
		} catch (error) {
			Logger.error({logId: log.logId, error}, 'Failed to index audit log');
			throw error;
		}
	}

	async indexAuditLogs(logs: Array<AdminAuditLog>): Promise<void> {
		if (!this.index) {
			throw new Error('Audit log search index not initialized');
		}

		if (logs.length === 0) return;

		const searchableLogs = logs.map((log) => this.convertToSearchableAuditLog(log));

		try {
			await this.index.addDocuments(searchableLogs, {primaryKey: 'logId'});
		} catch (error) {
			Logger.error({count: logs.length, error}, 'Failed to index audit logs');
			throw error;
		}
	}

	async deleteAuditLog(logId: bigint): Promise<void> {
		if (!this.index) {
			throw new Error('Audit log search index not initialized');
		}

		try {
			await this.index.deleteDocument(logId.toString());
		} catch (error) {
			Logger.error({logId, error}, 'Failed to delete audit log from search index');
			throw error;
		}
	}

	async searchAuditLogs(
		query: string,
		filters: AuditLogSearchFilters,
		options?: {
			limit?: number;
			offset?: number;
		},
	): Promise<{hits: Array<SearchableAuditLog>; total: number}> {
		if (!this.index) {
			throw new Error('Audit log search index not initialized');
		}

		const filterStrings = this.buildFilterStrings(filters);
		const sortField = this.buildSortField(filters);

		try {
			const result = await this.index.search(query, {
				filter: filterStrings.length > 0 ? filterStrings : undefined,
				limit: options?.limit ?? 50,
				offset: options?.offset ?? 0,
				sort: sortField,
			});

			return {
				hits: result.hits,
				total: result.estimatedTotalHits ?? 0,
			};
		} catch (error) {
			Logger.error({query, filters, error}, 'Failed to search audit logs');
			throw error;
		}
	}

	async deleteAllDocuments(): Promise<void> {
		if (!this.index) {
			throw new Error('Audit log search index not initialized');
		}

		try {
			await this.index.deleteAllDocuments();
			Logger.debug('All audit log documents deleted from search index');
		} catch (error) {
			Logger.error({error}, 'Failed to delete all audit log documents');
			throw error;
		}
	}

	private buildFilterStrings(filters: AuditLogSearchFilters): Array<string> {
		const filterStrings: Array<string> = [];

		if (filters.adminUserId) {
			filterStrings.push(`adminUserId = "${filters.adminUserId}"`);
		}

		if (filters.targetType) {
			filterStrings.push(`targetType = "${filters.targetType}"`);
		}

		if (filters.targetId) {
			filterStrings.push(`targetId = "${filters.targetId}"`);
		}

		if (filters.action) {
			filterStrings.push(`action = "${filters.action}"`);
		}

		return filterStrings;
	}

	private buildSortField(filters: AuditLogSearchFilters): Array<string> {
		const sortBy = filters.sortBy ?? 'createdAt';
		const sortOrder = filters.sortOrder ?? 'desc';

		if (sortBy === 'relevance') {
			return [];
		}

		return [`${sortBy}:${sortOrder}`];
	}

	private convertToSearchableAuditLog(log: AdminAuditLog): SearchableAuditLog {
		const createdAt = Math.floor(extractTimestamp(BigInt(log.logId)) / 1000);

		return {
			logId: log.logId.toString(),
			adminUserId: log.adminUserId.toString(),
			targetType: log.targetType,
			targetId: log.targetId.toString(),
			action: log.action,
			auditLogReason: log.auditLogReason,
			createdAt,
		};
	}
}
