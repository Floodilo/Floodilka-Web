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

// TestOAuth2TokenRefreshPreservesScopes verifies that refresh maintains
// the original granted scopes.
func TestOAuth2TokenRefreshPreservesScopes(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/refresh/scopes"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Refresh Scopes %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify", "email", "guilds"},
	)

	requestedScopes := []string{"identify", "email"}
	authCode, _ := authorizeOAuth2(
		t,
		client,
		endUser.Token,
		appID,
		redirectURI,
		requestedScopes,
		"",
		"",
		"",
	)
	initialTokens := exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		redirectURI,
		"",
	)

	refreshedTokens := refreshOAuth2Token(t, client, appID, clientSecret, initialTokens.RefreshToken)

	if refreshedTokens.Scope != "identify email" {
		t.Fatalf("refresh should preserve scopes: expected 'identify email', got %q", refreshedTokens.Scope)
	}

	introspection := introspectOAuth2Token(t, client, appID, clientSecret, refreshedTokens.AccessToken)
	if introspection.Scope != "identify email" {
		t.Fatalf("introspection scope should be 'identify email', got %s", introspection.Scope)
	}
}
