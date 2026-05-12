/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"testing"
)

// resetClientSecret resets the client secret for an OAuth2 application.
func resetClientSecret(t testing.TB, client *testClient, owner testAccount, applicationID string) string {
	t.Helper()
	payload := map[string]any{
		"password": owner.Password,
	}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s/client-secret/reset", applicationID), payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to reset client secret: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("reset client secret failed: %s", readResponseBody(resp))
	}
	var result struct {
		ClientSecret string `json:"client_secret"`
	}
	decodeJSONResponse(t, resp, &result)
	if result.ClientSecret == "" {
		t.Fatalf("reset client secret response missing client_secret")
	}
	return result.ClientSecret
}
