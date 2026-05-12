/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface SudoVerificationPayload extends Record<string, unknown> {
	password?: string;
	mfa_method?: 'totp' | 'sms' | 'webauthn';
	mfa_code?: string;
	webauthn_response?: unknown;
	webauthn_challenge?: string;
}
