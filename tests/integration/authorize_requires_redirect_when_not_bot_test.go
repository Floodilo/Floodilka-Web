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

// TestAuthorizeRequiresRedirectWhenNotBot verifies non-bot scopes require redirect_uri.
func TestAuthorizeRequiresRedirectWhenNotBot(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	appID, _, _, _ := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("NonBot Missing Redirect %d", time.Now().UnixNano()),
		[]string{"https://example.com/redirect"},
		[]string{"identify"},
	)

	payload := map[string]any{
		"client_id": appID,
		"scope":     "identify",
	}

	resp, err := client.postJSONWithAuth("/oauth2/authorize/consent", payload, endUser.Token)
	if err != nil {
		t.Fatalf("failed to authorize: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for missing redirect_uri, got %d", resp.StatusCode)
	}
}
