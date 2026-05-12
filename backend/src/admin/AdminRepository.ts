/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createUserID} from '~/BrandedTypes';
import {deleteOneOrMany, fetchMany, fetchOne, upsertOne} from '~/database/Cassandra';
import type {AdminAuditLogRow} from '~/database/types/AdminArchiveTypes';
import {AdminAuditLogs, BannedEmails, BannedIps, BannedPhones} from '~/Tables';
import type {AdminAuditLog, IAdminRepository} from './IAdminRepository';

const FETCH_AUDIT_LOG_BY_ID_QUERY = AdminAuditLogs.select({
	where: AdminAuditLogs.where.eq('log_id'),
});

const FETCH_AUDIT_LOGS_BY_IDS_QUERY = AdminAuditLogs.select({
	where: AdminAuditLogs.where.in('log_id', 'log_ids'),
});

const IS_IP_BANNED_QUERY = BannedIps.select({
	where: BannedIps.where.eq('ip'),
});

const LOAD_ALL_BANNED_IPS_QUERY = BannedIps.select();

const IS_EMAIL_BANNED_QUERY = BannedEmails.select({
	where: BannedEmails.where.eq('email_lower'),
});

const IS_PHONE_BANNED_QUERY = BannedPhones.select({
	where: BannedPhones.where.eq('phone'),
});

const createListAllAuditLogsPaginatedQuery = (limit: number) =>
	AdminAuditLogs.select({
		where: AdminAuditLogs.where.tokenGt('log_id', 'last_log_id'),
		limit,
	});

const createListAllAuditLogsFirstPageQuery = (limit: number) =>
	AdminAuditLogs.select({
		limit,
	});

export class AdminRepository implements IAdminRepository {
	async createAuditLog(log: AdminAuditLogRow): Promise<AdminAuditLog> {
		await upsertOne(AdminAuditLogs.insert(log));
		return this.mapRowToAuditLog(log);
	}

	async getAuditLog(logId: bigint): Promise<AdminAuditLog | null> {
		const row = await fetchOne<AdminAuditLogRow>(FETCH_AUDIT_LOG_BY_ID_QUERY.bind({log_id: logId}));
		return row ? this.mapRowToAuditLog(row) : null;
	}

	async listAuditLogsByIds(logIds: Array<bigint>): Promise<Array<AdminAuditLog>> {
		if (logIds.length === 0) {
			return [];
		}

		const rows = await fetchMany<AdminAuditLogRow>(FETCH_AUDIT_LOGS_BY_IDS_QUERY.bind({log_ids: logIds}));
		return rows.map((row) => this.mapRowToAuditLog(row));
	}

	async listAllAuditLogsPaginated(limit: number, lastLogId?: bigint): Promise<Array<AdminAuditLog>> {
		let rows: Array<AdminAuditLogRow>;

		if (lastLogId) {
			const query = createListAllAuditLogsPaginatedQuery(limit);
			rows = await fetchMany<AdminAuditLogRow>(query.bind({last_log_id: lastLogId}));
		} else {
			const query = createListAllAuditLogsFirstPageQuery(limit);
			rows = await fetchMany<AdminAuditLogRow>(query.bind({}));
		}

		return rows.map((row) => this.mapRowToAuditLog(row));
	}

	async isIpBanned(ip: string): Promise<boolean> {
		const result = await fetchOne<{ip: string}>(IS_IP_BANNED_QUERY.bind({ip}));
		return !!result;
	}

	async banIp(ip: string): Promise<void> {
		await upsertOne(BannedIps.insert({ip}));
	}

	async unbanIp(ip: string): Promise<void> {
		await deleteOneOrMany(BannedIps.deleteByPk({ip}));
	}

	async listBannedIps(): Promise<Array<string>> {
		const rows = await fetchMany<{ip: string}>(LOAD_ALL_BANNED_IPS_QUERY.bind({}));
		return rows.map((row) => row.ip);
	}

	async loadAllBannedIps(): Promise<Set<string>> {
		const rows = await fetchMany<{ip: string}>(LOAD_ALL_BANNED_IPS_QUERY.bind({}));
		return new Set(rows.map((row) => row.ip));
	}

	async isEmailBanned(email: string): Promise<boolean> {
		const emailLower = email.toLowerCase();
		const result = await fetchOne<{email_lower: string}>(IS_EMAIL_BANNED_QUERY.bind({email_lower: emailLower}));
		return !!result;
	}

	async banEmail(email: string): Promise<void> {
		const emailLower = email.toLowerCase();
		await upsertOne(BannedEmails.insert({email_lower: emailLower}));
	}

	async unbanEmail(email: string): Promise<void> {
		const emailLower = email.toLowerCase();
		await deleteOneOrMany(BannedEmails.deleteByPk({email_lower: emailLower}));
	}

	async isPhoneBanned(phone: string): Promise<boolean> {
		const result = await fetchOne<{phone: string}>(IS_PHONE_BANNED_QUERY.bind({phone}));
		return !!result;
	}

	async banPhone(phone: string): Promise<void> {
		await upsertOne(BannedPhones.insert({phone}));
	}

	async unbanPhone(phone: string): Promise<void> {
		await deleteOneOrMany(BannedPhones.deleteByPk({phone}));
	}

	private mapRowToAuditLog(row: AdminAuditLogRow): AdminAuditLog {
		return {
			logId: row.log_id,
			adminUserId: createUserID(row.admin_user_id),
			targetType: row.target_type,
			targetId: row.target_id,
			action: row.action,
			auditLogReason: row.audit_log_reason,
			metadata: row.metadata || new Map(),
			createdAt: row.created_at,
		};
	}
}
