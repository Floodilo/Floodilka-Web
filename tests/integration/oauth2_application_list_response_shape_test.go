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

// TestOAuth2ApplicationListResponseShape validates the response structure matches the API contract.
func TestOAuth2ApplicationListResponseShape(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	appName := fmt.Sprintf("Shape Test %d", time.Now().UnixNano())
	createOAuth2BotApplication(t, client, owner, appName, []string{"https://example.com/callback"})

	resp, err := client.getWithAuth("/oauth2/applications/@me", owner.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	// Parse as array of maps
	var data []map[string]any
	decodeJSONResponse(t, resp, &data)

	if len(data) == 0 {
		t.Fatalf("expected at least one application in list")
	}

	app := data[0]

	requiredFields := []string{"id", "name", "redirect_uris"}
	for _, field := range requiredFields {
		if _, ok := app[field]; !ok {
			t.Fatalf("application missing required field %q: %#v", field, app)
		}
	}

	if _, ok := app["client_secret"]; ok {
		t.Fatalf("client_secret should not be included in list response")
	}

	if bot, ok := app["bot"].(map[string]any); ok {
		botRequiredFields := []string{"id", "username", "discriminator"}
		for _, field := range botRequiredFields {
			if _, ok := bot[field]; !ok {
				t.Fatalf("bot object missing required field %q: %#v", field, bot)
			}
		}
		if _, ok := bot["token"]; ok {
			t.Fatalf("bot token should not be included in list response")
		}
	}
}
