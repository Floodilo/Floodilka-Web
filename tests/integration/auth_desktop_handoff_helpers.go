/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"regexp"
)

type handoffInitiateResponse struct {
	Code      string `json:"code"`
	ExpiresAt string `json:"expires_at"`
}

type handoffStatusResponse struct {
	Status string `json:"status"`
	Token  string `json:"token,omitempty"`
	UserID string `json:"user_id,omitempty"`
}

// validateHandoffCodeFormat checks that the code matches XXXX-XXXX format
// with uppercase letters and digits (excluding ambiguous characters 0/O, 1/I/L)
func validateHandoffCodeFormat(code string) bool {
	pattern := regexp.MustCompile(`^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$`)
	return pattern.MatchString(code)
}
