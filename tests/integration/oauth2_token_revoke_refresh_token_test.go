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

// TestOAuth2TokenRevokeRefreshToken verifies that revoking a refresh token
// prevents it from being used to get new access tokens.
func TestOAuth2TokenRevokeRefreshToken(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/revoke/refresh"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Revoke Refresh %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify"},
	)

	authCode, _ := authorizeOAuth2(
		t,
		client,
		endUser.Token,
		appID,
		redirectURI,
		[]string{"identify"},
		"",
		"",
		"",
	)
	tokens := exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		redirectURI,
		"",
	)

	refreshed := refreshOAuth2Token(t, client, appID, clientSecret, tokens.RefreshToken)
	if refreshed.AccessToken == "" {
		t.Fatal("refresh token should work before revocation")
	}

	revokeOAuth2Token(t, client, appID, clientSecret, tokens.RefreshToken, "refresh_token")

	introspection := introspectOAuth2Token(t, client, appID, clientSecret, tokens.RefreshToken)
	if introspection.Active {
		t.Fatal("introspection should show revoked refresh token as inactive")
	}
}
