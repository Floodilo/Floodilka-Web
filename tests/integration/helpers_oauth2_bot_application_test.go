/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

// createOAuth2BotApplication is a convenience wrapper that returns only the bot-related fields.
// All applications have both bot tokens and client secrets; this just ignores the client secret.
func createOAuth2BotApplication(t testing.TB, client *testClient, owner testAccount, name string, redirectURIs []string) (applicationID string, botUserID string, botToken string) {
	t.Helper()
	payload := map[string]any{
		"name":          name,
		"redirect_uris": redirectURIs,
	}
	resp, err := client.postJSONWithAuth("/oauth2/applications", payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to create application: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("application creation failed: %s", readResponseBody(resp))
	}
	var created struct {
		ID           string `json:"id"`
		ClientSecret string `json:"client_secret"`
		Bot          struct {
			ID    string `json:"id"`
			Token string `json:"token"`
		} `json:"bot"`
	}
	decodeJSONResponse(t, resp, &created)
	if created.ID == "" {
		t.Fatalf("application response missing id")
	}
	if created.ClientSecret == "" {
		t.Fatalf("application response missing client_secret")
	}
	if created.Bot.ID == "" {
		t.Fatalf("application response missing bot.id")
	}
	if created.Bot.Token == "" {
		t.Fatalf("application response missing bot.token")
	}
	storeClientSecret(created.ID, created.ClientSecret)
	return created.ID, created.Bot.ID, created.Bot.Token
}
