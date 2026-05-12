/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MobilePushTokenRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class MobilePushToken {
	readonly userId: UserID;
	readonly tokenId: string;
	readonly token: string;
	readonly platform: string;
	readonly createdAt: Date;

	constructor(row: MobilePushTokenRow) {
		this.userId = row.user_id;
		this.tokenId = row.token_id;
		this.token = row.push_token;
		this.platform = row.platform;
		this.createdAt = row.created_at;
	}

	toRow(): MobilePushTokenRow {
		return {
			user_id: this.userId,
			token_id: this.tokenId,
			push_token: this.token,
			platform: this.platform,
			created_at: this.createdAt,
		};
	}
}
