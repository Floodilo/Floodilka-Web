/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildID, UserID} from '~/BrandedTypes';
import type {AuditLogActionType} from '~/constants/AuditLogActionType';
import type {GuildAuditLogRow, GuildBanRow} from '~/database/CassandraTypes';
import type {GuildAuditLog, GuildBan} from '~/Models';

export abstract class IGuildModerationRepository {
	abstract getBan(guildId: GuildID, userId: UserID): Promise<GuildBan | null>;
	abstract listBans(guildId: GuildID): Promise<Array<GuildBan>>;
	abstract upsertBan(data: GuildBanRow): Promise<GuildBan>;
	abstract deleteBan(guildId: GuildID, userId: UserID): Promise<void>;
	abstract createAuditLog(data: GuildAuditLogRow): Promise<GuildAuditLog>;
	abstract getAuditLog(guildId: GuildID, logId: bigint): Promise<GuildAuditLog | null>;
	abstract listAuditLogs(params: {
		guildId: GuildID;
		limit: number;
		afterLogId?: bigint;
		beforeLogId?: bigint;
		userId?: UserID;
		actionType?: AuditLogActionType;
	}): Promise<Array<GuildAuditLog>>;
	abstract listAuditLogsByIds(guildId: GuildID, logIds: Array<bigint>): Promise<Array<GuildAuditLog>>;
	abstract deleteAuditLogs(guildId: GuildID, logs: Array<GuildAuditLog>): Promise<void>;
	abstract updateAuditLogsIndexedAt(guildId: GuildID, indexedAt: Date | null): Promise<void>;
}
