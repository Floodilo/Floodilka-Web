/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

// listOAuth2Applications retrieves all OAuth2 applications for the authenticated user.
func listOAuth2Applications(t testing.TB, client *testClient, token string) []oauth2ApplicationResponse {
	t.Helper()
	resp, err := client.getWithAuth("/oauth2/applications/@me", token)
	if err != nil {
		t.Fatalf("failed to list applications: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list applications failed: %s", readResponseBody(resp))
	}
	var apps []oauth2ApplicationResponse
	decodeJSONResponse(t, resp, &apps)
	return apps
}
