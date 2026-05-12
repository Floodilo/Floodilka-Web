/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {WebAuthnCredentialRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class WebAuthnCredential {
	readonly credentialId: string;
	readonly publicKey: Buffer;
	readonly counter: bigint;
	readonly transports: Set<string> | null;
	readonly name: string;
	readonly createdAt: Date;
	readonly lastUsedAt: Date | null;
	readonly version: number;

	constructor(row: WebAuthnCredentialRow) {
		this.credentialId = row.credential_id;
		this.publicKey = row.public_key;
		this.counter = row.counter;
		this.transports = row.transports ?? null;
		this.name = row.name;
		this.createdAt = row.created_at;
		this.lastUsedAt = row.last_used_at ?? null;
		this.version = row.version;
	}

	toRow(userId: UserID): WebAuthnCredentialRow {
		return {
			user_id: userId,
			credential_id: this.credentialId,
			public_key: this.publicKey,
			counter: this.counter,
			transports: this.transports,
			name: this.name,
			created_at: this.createdAt,
			last_used_at: this.lastUsedAt,
			version: this.version,
		};
	}
}
