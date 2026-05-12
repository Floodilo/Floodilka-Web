/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ApplicationID, UserID} from '~/BrandedTypes';
import type {OAuth2AccessTokenRow} from '~/database/types/OAuth2Types';

export class OAuth2AccessToken {
	readonly token: string;
	readonly applicationId: ApplicationID;
	readonly userId: UserID | null;
	readonly scope: Set<string>;
	readonly createdAt: Date;

	constructor(row: OAuth2AccessTokenRow) {
		this.token = row.token_;
		this.applicationId = row.application_id;
		this.userId = row.user_id;
		this.scope = row.scope;
		this.createdAt = row.created_at;
	}

	toRow(): OAuth2AccessTokenRow {
		return {
			token_: this.token,
			application_id: this.applicationId,
			user_id: this.userId,
			scope: this.scope,
			created_at: this.createdAt,
		};
	}

	hasScope(scope: string): boolean {
		return this.scope.has(scope);
	}
}
