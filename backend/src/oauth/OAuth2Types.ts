/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface ApplicationBotResponse {
	id: string;
	username: string;
	avatar?: string | null;
	banner?: string | null;
	bio: string | null;
	token?: string;
	mfa_enabled?: boolean;
	authenticator_types?: Array<number>;
}

export interface ApplicationResponse {
	id: string;
	name: string;
	redirect_uris: Array<string>;
	bot_public: boolean;
	bot_require_code_grant: boolean;
	client_secret?: string;
	bot?: ApplicationBotResponse;
}
