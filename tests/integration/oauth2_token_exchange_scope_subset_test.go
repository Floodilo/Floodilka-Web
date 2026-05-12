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

// TestOAuth2TokenExchangeScopeSubset verifies that the token response
// contains the scopes that were actually granted.
func TestOAuth2TokenExchangeScopeSubset(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/token/scopes"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Scope Test %d", time.Now().UnixNano()),
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

	tokenResp := exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		redirectURI,
		"",
	)

	if tokenResp.Scope != "identify email" {
		t.Fatalf("expected scope 'identify email', got %q", tokenResp.Scope)
	}

	introspection := introspectOAuth2Token(t, client, appID, clientSecret, tokenResp.AccessToken)
	if introspection.Scope != "identify email" {
		t.Fatalf("introspection scope should be 'identify email', got %s", introspection.Scope)
	}
}
