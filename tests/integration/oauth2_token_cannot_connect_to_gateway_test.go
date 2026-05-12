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

// TestOAuth2TokenCannotConnectToGateway verifies that OAuth2 access tokens
// cannot connect to the gateway; only bot tokens should be accepted for gateway use.
func TestOAuth2TokenCannotConnectToGateway(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	appName := fmt.Sprintf("Gateway OAuth2 Client %d", time.Now().UnixNano())
	redirectURI := "https://example.com/callback"
	appID, _, _, clientSecret := createOAuth2Application(t, client, owner, appName, []string{redirectURI}, []string{"identify"})

	code, _ := obtainAuthCode(t, client, appID, redirectURI, []string{"identify"})
	token := exchangeOAuth2AuthorizationCode(t, client, appID, clientSecret, code, redirectURI, "")

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/gateway/bot", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build gateway bot request: %v", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token.AccessToken))
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("gateway bot request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401 for OAuth2 access token on /gateway/bot, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
