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

// obtainAuthCode is a helper to obtain an authorization code for a given application/redirect using a fresh end-user.
func obtainAuthCode(t testing.TB, client *testClient, appID string, redirectURI string, scopes []string) (code string, user testAccount) {
	t.Helper()
	user = createTestAccount(t, client)
	code, _ = authorizeOAuth2(t, client, user.Token, appID, redirectURI, scopes, "", "", "")
	if code == "" {
		t.Fatalf("failed to obtain authorization code")
	}
	return code, user
}
