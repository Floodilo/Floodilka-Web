/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GuildBanRow} from '~/database/CassandraTypes';
import type {GuildID, UserID} from '../BrandedTypes';

export class GuildBan {
	readonly guildId: GuildID;
	readonly userId: UserID;
	readonly moderatorId: UserID;
	readonly bannedAt: Date;
	readonly expiresAt: Date | null;
	readonly reason: string | null;
	readonly ipAddress: string | null;

	constructor(row: GuildBanRow) {
		this.guildId = row.guild_id;
		this.userId = row.user_id;
		this.moderatorId = row.moderator_id;
		this.bannedAt = row.banned_at;
		this.expiresAt = row.expires_at ?? null;
		this.reason = row.reason ?? null;
		this.ipAddress = row.ip ?? null;
	}

	toRow(): GuildBanRow {
		return {
			guild_id: this.guildId,
			user_id: this.userId,
			moderator_id: this.moderatorId,
			banned_at: this.bannedAt,
			expires_at: this.expiresAt,
			reason: this.reason,
			ip: this.ipAddress,
		};
	}
}
