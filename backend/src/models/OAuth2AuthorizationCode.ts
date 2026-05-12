/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ApplicationID, UserID} from '~/BrandedTypes';
import type {OAuth2AuthorizationCodeRow} from '~/database/types/OAuth2Types';

export class OAuth2AuthorizationCode {
	readonly code: string;
	readonly applicationId: ApplicationID;
	readonly userId: UserID;
	readonly redirectUri: string;
	readonly scope: Set<string>;
	readonly nonce: string | null;
	readonly createdAt: Date;

	constructor(row: OAuth2AuthorizationCodeRow) {
		this.code = row.code;
		this.applicationId = row.application_id;
		this.userId = row.user_id;
		this.redirectUri = row.redirect_uri;
		this.scope = row.scope;
		this.nonce = row.nonce;
		this.createdAt = row.created_at;
	}

	toRow(): OAuth2AuthorizationCodeRow {
		return {
			code: this.code,
			application_id: this.applicationId,
			user_id: this.userId,
			redirect_uri: this.redirectUri,
			scope: this.scope,
			nonce: this.nonce,
			created_at: this.createdAt,
		};
	}

	hasScope(scope: string): boolean {
		return this.scope.has(scope);
	}
}
