/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"sync"
)

// Track client secrets by application ID to enforce confidential-client flows.
var oauthClientSecrets sync.Map // map[string]string

// storeClientSecret stores a client secret for an OAuth2 application.
func storeClientSecret(appID string, clientSecret string) {
	if appID != "" && clientSecret != "" {
		oauthClientSecrets.Store(appID, clientSecret)
	}
}
