/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RelationshipRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class Relationship {
	readonly sourceUserId: UserID;
	readonly targetUserId: UserID;
	readonly type: number;
	readonly nickname: string | null;
	readonly since: Date | null;
	readonly version: number;

	constructor(row: RelationshipRow) {
		this.sourceUserId = row.source_user_id;
		this.targetUserId = row.target_user_id;
		this.type = row.type;
		this.nickname = row.nickname ?? null;
		this.since = row.since ?? null;
		this.version = row.version;
	}

	toRow(): RelationshipRow {
		return {
			source_user_id: this.sourceUserId,
			target_user_id: this.targetUserId,
			type: this.type,
			nickname: this.nickname,
			since: this.since,
			version: this.version,
		};
	}
}
