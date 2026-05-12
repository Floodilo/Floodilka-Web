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

// TestPublicApplicationFetch validates unauthenticated public metadata retrieval.
func TestPublicApplicationFetch(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)

	appID, _, _, _ := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Public App Fetch %d", time.Now().UnixNano()),
		[]string{"https://example.com/redirect"},
		[]string{"bot", "applications.commands"},
	)

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/oauth2/applications/%s/public", client.baseURL, appID), nil)
	if err != nil {
		t.Fatalf("failed to build request: %v", err)
	}
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for public application fetch, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var payload struct {
		ID           string   `json:"id"`
		Name         string   `json:"name"`
		RedirectURIs []string `json:"redirect_uris"`
		Scopes       []string `json:"scopes"`
		BotPublic    bool     `json:"bot_public"`
	}
	decodeJSONResponse(t, resp, &payload)
	if payload.ID != appID {
		t.Fatalf("expected id %s, got %s", appID, payload.ID)
	}
	if len(payload.RedirectURIs) == 0 {
		t.Fatalf("redirect_uris should be populated")
	}
	if len(payload.Scopes) == 0 {
		t.Fatalf("scopes should be populated")
	}
}
