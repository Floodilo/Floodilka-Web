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

// TestOAuth2ApplicationGetAccessControl validates that users can only access their own applications.
func TestOAuth2ApplicationGetAccessControl(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	otherUser := createTestAccount(t, client)

	name := fmt.Sprintf("Access Control App %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}
	scopes := []string{"identify"}

	appID, _, _, _ := createOAuth2Application(t, client, owner, name, redirectURIs, scopes)

	resp, err := client.getWithAuth(fmt.Sprintf("/oauth2/applications/%s", appID), otherUser.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden when accessing another user's application, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
