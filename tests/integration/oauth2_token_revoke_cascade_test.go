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

// TestOAuth2TokenRevokeCascade verifies that revoking a refresh token
// may cascade to associated access tokens (implementation-specific).
func TestOAuth2TokenRevokeCascade(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/revoke/cascade"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Revoke Cascade %d", time.Now().UnixNano()),
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

	revokeOAuth2Token(t, client, appID, clientSecret, tokens.RefreshToken, "refresh_token")

	introspectionOriginal := introspectOAuth2Token(t, client, appID, clientSecret, tokens.AccessToken)
	introspectionRefreshed := introspectOAuth2Token(t, client, appID, clientSecret, refreshed.AccessToken)

	t.Logf("Original access token active after refresh token revocation: %v", introspectionOriginal.Active)
	t.Logf("Refreshed access token active after refresh token revocation: %v", introspectionRefreshed.Active)

}
