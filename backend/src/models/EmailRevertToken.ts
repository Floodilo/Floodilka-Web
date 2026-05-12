/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {EmailRevertTokenRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';
import {createEmailRevertToken} from '../BrandedTypes';

export class EmailRevertToken {
	readonly token: string;
	readonly userId: UserID;
	readonly email: string;

	constructor(row: EmailRevertTokenRow) {
		this.token = row.token_;
		this.userId = row.user_id;
		this.email = row.email;
	}

	toRow(): EmailRevertTokenRow {
		return {
			token_: createEmailRevertToken(this.token),
			user_id: this.userId,
			email: this.email,
		};
	}
}
