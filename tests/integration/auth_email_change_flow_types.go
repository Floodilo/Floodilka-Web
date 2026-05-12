/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

type emailChangeStartResponse struct {
	Ticket             string  `json:"ticket"`
	RequireOriginal    bool    `json:"require_original"`
	OriginalProof      *string `json:"original_proof,omitempty"`
	OriginalCodeExpiry *string `json:"original_code_expires_at,omitempty"`
	ResendAvailableAt  *string `json:"resend_available_at,omitempty"`
}

type emailChangeVerifyOriginalResponse struct {
	OriginalProof string `json:"original_proof"`
}

type emailChangeRequestNewResponse struct {
	Ticket            string  `json:"ticket"`
	NewEmail          string  `json:"new_email"`
	NewCodeExpiresAt  string  `json:"new_code_expires_at"`
	ResendAvailableAt *string `json:"resend_available_at,omitempty"`
}

type emailChangeVerifyNewResponse struct {
	EmailToken string `json:"email_token"`
}
