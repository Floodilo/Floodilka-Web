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

// TestOAuth2ApplicationDeleteNotFound validates error handling for non-existent applications.
func TestOAuth2ApplicationDeleteNotFound(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	fakeAppID := "999999999999999999"
	sudoPayload := map[string]any{
		"password": owner.Password,
	}

	resp, err := client.deleteJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", fakeAppID), sudoPayload, owner.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 Not Found, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
