/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildAuditLogRow} from '~/database/CassandraTypes';
import type {GuildAuditLogChange} from '~/guild/GuildAuditLogTypes';
import type {GuildID, UserID} from '../BrandedTypes';
import {extractTimestamp} from '../utils/SnowflakeUtils';

export class GuildAuditLog {
	readonly guildId: GuildID;
	readonly logId: bigint;
	readonly userId: UserID;
	readonly targetId: string | null;
	readonly actionType: number;
	readonly reason: string | null;
	readonly options: Map<string, string>;
	readonly changes: GuildAuditLogChange | null;
	readonly createdAt: Date;

	constructor(row: GuildAuditLogRow) {
		this.guildId = row.guild_id;
		this.logId = row.log_id;
		this.userId = row.user_id;
		this.targetId = row.target_id ?? null;
		this.actionType = row.action_type;
		this.reason = row.reason ?? null;
		this.options = row.options ?? new Map();
		this.changes = row.changes ? this.safeParseChanges(row.changes) : null;
		this.createdAt = new Date(extractTimestamp(this.logId));
	}

	toRow(): GuildAuditLogRow {
		return {
			guild_id: this.guildId,
			log_id: this.logId,
			user_id: this.userId,
			target_id: this.targetId,
			action_type: this.actionType,
			reason: this.reason,
			options: this.options.size > 0 ? this.options : null,
			changes: this.changes ? JSON.stringify(this.changes) : null,
		};
	}

	private safeParseChanges(raw: string): GuildAuditLogChange | null {
		try {
			return JSON.parse(raw) as GuildAuditLogChange;
		} catch {
			return null;
		}
	}
}
