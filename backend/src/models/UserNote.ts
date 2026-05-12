/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {NoteRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';

export class UserNote {
	readonly sourceUserId: UserID;
	readonly targetUserId: UserID;
	readonly note: string;
	readonly version: number;

	constructor(row: NoteRow) {
		this.sourceUserId = row.source_user_id;
		this.targetUserId = row.target_user_id;
		this.note = row.note;
		this.version = row.version;
	}

	toRow(): NoteRow {
		return {
			source_user_id: this.sourceUserId,
			target_user_id: this.targetUserId,
			note: this.note,
			version: this.version,
		};
	}
}
