/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {AuthSessionRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class AuthSession {
	readonly userId: UserID;
	readonly sessionIdHash: Buffer;
	readonly createdAt: Date;
	readonly approximateLastUsedAt: Date;
	readonly clientIp: string;
	readonly clientUserAgent: string | null;
	readonly clientIsDesktop: boolean | null;
	readonly version: number;

	constructor(row: AuthSessionRow) {
		this.userId = row.user_id;
		this.sessionIdHash = row.session_id_hash;
		this.createdAt = row.created_at;
		this.approximateLastUsedAt = row.approx_last_used_at;
		this.clientIp = row.client_ip;
		this.clientUserAgent = row.client_user_agent ?? null;
		this.clientIsDesktop = row.client_is_desktop ?? null;
		this.version = row.version;
	}

	toRow(): AuthSessionRow {
		return {
			user_id: this.userId,
			session_id_hash: this.sessionIdHash,
			created_at: this.createdAt,
			approx_last_used_at: this.approximateLastUsedAt,
			client_ip: this.clientIp,
			client_user_agent: this.clientUserAgent,
			client_is_desktop: this.clientIsDesktop,
			version: this.version,
		};
	}
}
