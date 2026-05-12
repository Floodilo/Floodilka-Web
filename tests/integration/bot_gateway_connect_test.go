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

// TestBotGatewayConnect verifies that bot tokens can successfully connect to the gateway.
// Unlike OAuth2 access tokens which cannot connect to the gateway, bot tokens are
// specifically designed for persistent WebSocket connections in this platform.
func TestBotGatewayConnect(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	appName := fmt.Sprintf("Gateway Bot %d", time.Now().UnixNano())
	redirectURI := "https://example.com/callback"
	_, botUserID, botToken := createOAuth2BotApplication(t, client, owner, appName, []string{redirectURI})

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/gateway/bot", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build gateway request: %v", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("gateway bot request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("get gateway bot failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	if resp.StatusCode == http.StatusOK {
		var gatewayInfo map[string]any
		decodeJSONResponse(t, resp, &gatewayInfo)

		if gatewayURL, ok := gatewayInfo["url"].(string); ok && gatewayURL != "" {
			t.Logf("Gateway URL: %s", gatewayURL)
		}

		if shards, ok := gatewayInfo["shards"]; ok {
			t.Logf("Recommended shards: %v", shards)
		}
	}

	gc := newGatewayClient(t, client, botToken)
	defer gc.Close()

	t.Logf("Bot successfully connected to gateway")

	sessionID := gc.SessionID()
	if sessionID == "" {
		t.Fatalf("gateway client should have session ID after READY")
	}

	sequence := gc.Sequence()
	t.Logf("Gateway session established - ID: %s, Sequence: %d", sessionID, sequence)

	t.Logf("Bot ID %s successfully authenticated via gateway", botUserID)
}
