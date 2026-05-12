/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
	"time"
)

// TestOAuth2ClientSecretNotLeaked verifies that client_secret is only shown once
// during application creation and never exposed in subsequent GET requests.
// Secrets should remain write-only and must be stored securely by the application owner.
func TestOAuth2ClientSecretNotLeaked(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)

	redirectURI := "https://example.com/callback"
	appID, _, _, clientSecret := createOAuth2Application(t, client, appOwner,
		fmt.Sprintf("Secret Test App %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify"},
	)

	if clientSecret == "" {
		t.Fatalf("client_secret should be returned on application creation")
	}

	t.Run("GET application does not expose client_secret", func(t *testing.T) {
		app := getOAuth2Application(t, client, appOwner.Token, appID)

		if app.ID != appID {
			t.Fatalf("expected application ID %s, got %s", appID, app.ID)
		}

		if app.ClientSecret != "" {
			t.Fatalf("GET application exposed the client_secret - security leak")
		}
	})

	t.Run("LIST applications does not expose client_secret", func(t *testing.T) {
		apps := listOAuth2Applications(t, client, appOwner.Token)

		var foundApp *oauth2ApplicationResponse
		for i := range apps {
			if apps[i].ID == appID {
				foundApp = &apps[i]
				break
			}
		}

		if foundApp == nil {
			t.Fatalf("created application not found in list")
			return
		}

		if foundApp.ClientSecret != "" {
			t.Fatalf("LIST applications exposed the client_secret - security leak")
		}
	})

	t.Run("UPDATE application does not expose client_secret", func(t *testing.T) {
		updates := map[string]any{
			"name": fmt.Sprintf("Updated App %d", time.Now().UnixNano()),
		}
		updatedApp := updateOAuth2Application(t, client, appOwner.Token, appID, updates)

		if updatedApp.ID != appID {
			t.Fatalf("expected application ID %s, got %s", appID, updatedApp.ID)
		}

		if updatedApp.ClientSecret != "" {
			t.Fatalf("UPDATE application exposed the client_secret - security leak")
		}
	})

	t.Run("client_secret still works for authentication", func(t *testing.T) {
		endUser := createTestAccount(t, client)

		authCode, _ := authorizeOAuth2(t, client, endUser.Token, appID, redirectURI, []string{"identify"}, "", "", "")

		token := exchangeOAuth2AuthorizationCode(t, client, appID, clientSecret, authCode, redirectURI, "")

		if token.AccessToken == "" {
			t.Fatalf("original client_secret should still work for token exchange")
		}
	})
}
