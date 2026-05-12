/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

type userMeResponse struct {
	ID                 string `json:"id"`
	Bot                bool   `json:"bot"`
	MFAEnabled         bool   `json:"mfa_enabled"`
	AuthenticatorTypes []int  `json:"authenticator_types"`
}
