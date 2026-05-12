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

// TestOAuth2ApplicationUpdateAccessControl validates that users can only update their own applications.
func TestOAuth2ApplicationUpdateAccessControl(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	otherUser := createTestAccount(t, client)

	name := fmt.Sprintf("Access Control Test %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}

	appID, _, _ := createOAuth2BotApplication(t, client, owner, name, redirectURIs)

	updates := map[string]any{
		"name": "Hacked Name",
	}

	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", appID), updates, otherUser.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	app := getOAuth2Application(t, client, owner.Token, appID)
	if app.Name != name {
		t.Fatalf("application should not have been modified by unauthorized user")
	}
}
