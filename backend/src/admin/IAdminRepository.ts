/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import type {AdminAuditLogRow} from '~/database/types/AdminArchiveTypes';

export type {AdminAuditLogRow};

export interface AdminAuditLog {
	logId: bigint;
	adminUserId: UserID;
	targetType: string;
	targetId: bigint;
	action: string;
	auditLogReason: string | null;
	metadata: Map<string, string>;
	createdAt: Date;
}

export abstract class IAdminRepository {
	abstract createAuditLog(log: AdminAuditLogRow): Promise<AdminAuditLog>;
	abstract getAuditLog(logId: bigint): Promise<AdminAuditLog | null>;
	abstract listAuditLogsByIds(logIds: Array<bigint>): Promise<Array<AdminAuditLog>>;
	abstract listAllAuditLogsPaginated(limit: number, lastLogId?: bigint): Promise<Array<AdminAuditLog>>;

	abstract isIpBanned(ip: string): Promise<boolean>;
	abstract banIp(ip: string): Promise<void>;
	abstract unbanIp(ip: string): Promise<void>;
	abstract listBannedIps(limit?: number): Promise<Array<string>>;

	abstract isEmailBanned(email: string): Promise<boolean>;
	abstract banEmail(email: string): Promise<void>;
	abstract unbanEmail(email: string): Promise<void>;

	abstract isPhoneBanned(phone: string): Promise<boolean>;
	abstract banPhone(phone: string): Promise<void>;
	abstract unbanPhone(phone: string): Promise<void>;

	abstract loadAllBannedIps(): Promise<Set<string>>;
}
