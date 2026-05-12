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

// TestBotAuthorizeAllowsNoRedirect verifies bot-only authorize flow works without redirect_uri.
func TestBotAuthorizeAllowsNoRedirect(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	appID, _, _, _ := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Bot No Redirect %d", time.Now().UnixNano()),
		nil,
		[]string{"bot"},
	)

	payload := map[string]any{
		"client_id": appID,
		"scope":     "bot",
	}

	resp, err := client.postJSONWithAuth("/oauth2/authorize/consent", payload, endUser.Token)
	if err != nil {
		t.Fatalf("failed to authorize: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for bot-only consent, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var body struct {
		RedirectTo string `json:"redirect_to"`
	}
	decodeJSONResponse(t, resp, &body)
	if body.RedirectTo == "" {
		t.Fatal("redirect_to should be returned for bot-only consent")
	}
}
