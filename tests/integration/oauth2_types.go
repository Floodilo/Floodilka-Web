/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

type oauth2AuthorizationResponse struct {
	Application  oauth2ApplicationResponse `json:"application"`
	Scopes       []string                  `json:"scopes"`
	AuthorizedAt string                    `json:"authorized_at"`
}
