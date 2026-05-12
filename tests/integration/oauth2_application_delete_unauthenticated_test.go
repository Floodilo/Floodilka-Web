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
	"time"
)

// TestOAuth2ApplicationDeleteUnauthenticated validates that authentication is required.
func TestOAuth2ApplicationDeleteUnauthenticated(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Unauth Delete %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}
	scopes := []string{"identify"}

	var _ []string = scopes
	appID, _, _ := createOAuth2BotApplication(t, client, owner, name, redirectURIs)

	sudoPayload := map[string]any{
		"password": owner.Password,
	}

	resp, err := client.deleteJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", appID), sudoPayload, "")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
