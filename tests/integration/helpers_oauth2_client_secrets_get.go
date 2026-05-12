/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

// getClientSecret retrieves the stored client secret for an OAuth2 application.
func getClientSecret(t testing.TB, appID string) string {
	if appID == "" {
		t.Fatalf("client_id is required")
	}
	if secret, ok := oauthClientSecrets.Load(appID); ok {
		return secret.(string)
	}
	t.Fatalf("missing client_secret for application %s", appID)
	return ""
}
