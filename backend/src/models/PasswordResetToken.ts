/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {PasswordResetTokenRow} from '~/database/CassandraTypes';
import type {UserID} from '../BrandedTypes';
import {createPasswordResetToken} from '../BrandedTypes';

export class PasswordResetToken {
	readonly token: string;
	readonly userId: UserID;
	readonly email: string;

	constructor(row: PasswordResetTokenRow) {
		this.token = row.token_;
		this.userId = row.user_id;
		this.email = row.email;
	}

	toRow(): PasswordResetTokenRow {
		return {
			token_: createPasswordResetToken(this.token),
			user_id: this.userId,
			email: this.email,
		};
	}
}
