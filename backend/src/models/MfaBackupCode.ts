/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MfaBackupCodeRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';
import {createMfaBackupCode} from '../BrandedTypes';

export class MfaBackupCode {
	readonly userId: UserID;
	readonly code: string;
	readonly consumed: boolean;

	constructor(row: MfaBackupCodeRow) {
		this.userId = row.user_id;
		this.code = row.code;
		this.consumed = row.consumed ?? false;
	}

	toRow(): MfaBackupCodeRow {
		return {
			user_id: this.userId,
			code: createMfaBackupCode(this.code),
			consumed: this.consumed,
		};
	}
}
