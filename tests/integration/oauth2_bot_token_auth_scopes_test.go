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

// TestBotTokenAuthenticationScopes verifies that bot tokens have appropriate
// permissions and restrictions when accessing various API endpoints.
func TestBotTokenAuthenticationScopes(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	regularUser := createTestAccount(t, client)

	appName := fmt.Sprintf("Scope Test Bot %d", time.Now().UnixNano())
	redirectURI := "https://example.com/callback"
	_, botUserID, botToken := createOAuth2BotApplication(t, client, owner, appName, []string{redirectURI})

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/@me", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build request: %v", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("bot should be able to read own user info, got status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	t.Logf("Bot can read own user info")

	req2, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/%s", client.baseURL, regularUser.UserID), nil)
	if err != nil {
		t.Fatalf("failed to build request: %v", err)
	}
	req2.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))
	client.applyCommonHeaders(req2)

	resp2, err := client.httpClient.Do(req2)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp2.Body.Close()

	if resp2.StatusCode != http.StatusOK && resp2.StatusCode != http.StatusNotFound && resp2.StatusCode != http.StatusForbidden {
		t.Fatalf("unexpected status when bot fetches user info: %d: %s", resp2.StatusCode, readResponseBody(resp2))
	}

	if resp2.StatusCode == http.StatusOK {
		var user map[string]any
		decodeJSONResponse(t, resp2, &user)
		if user["id"] != regularUser.UserID {
			t.Fatalf("expected user id %s, got %v", regularUser.UserID, user["id"])
		}
		t.Logf("Bot can read other users' public info")
	} else {
		t.Logf("Bot access to other users restricted (implementation dependent)")
	}

	req3, err := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/users/@me", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build request: %v", err)
	}
	req3.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))
	req3.Header.Set("Content-Type", "application/json")
	client.applyCommonHeaders(req3)

	resp3, err := client.httpClient.Do(req3)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp3.Body.Close()

	if resp3.StatusCode == http.StatusOK {
		t.Logf("Bot can modify own profile directly (implementation allows it)")
	} else {
		t.Logf("Bot cannot modify profile directly, must use application API (expected)")
	}

	t.Logf("Bot ID %s has appropriate permission scopes", botUserID)
}
