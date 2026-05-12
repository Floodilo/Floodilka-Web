/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

const sudoModeHeader = "X-Floodilka-Sudo-Mode-JWT"

// errorResponse represents a standard API error response
type errorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}
