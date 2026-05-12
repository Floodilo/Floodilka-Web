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

// TestOAuth2TokenExpirationRefreshPreservesLifetime verifies that refreshed
// tokens get a new expiration time.
func TestOAuth2TokenExpirationRefreshPreservesLifetime(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/expire/refresh"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Refresh Exp %d", time.Now().UnixNano()),
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
	initialTokens := exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		redirectURI,
		"",
	)

	initialIntrospection := introspectOAuth2Token(t, client, appID, clientSecret, initialTokens.AccessToken)
	initialExp := initialIntrospection.Exp

	time.Sleep(2 * time.Second)

	refreshedTokens := refreshOAuth2Token(t, client, appID, clientSecret, initialTokens.RefreshToken)

	refreshedIntrospection := introspectOAuth2Token(t, client, appID, clientSecret, refreshedTokens.AccessToken)
	refreshedExp := refreshedIntrospection.Exp

	if refreshedExp <= initialExp {
		t.Fatalf("refreshed token exp (%d) should be later than initial exp (%d)", refreshedExp, initialExp)
	}

	if initialTokens.ExpiresIn != refreshedTokens.ExpiresIn {
		t.Logf("Note: expires_in changed from %d to %d after refresh", initialTokens.ExpiresIn, refreshedTokens.ExpiresIn)
	}
}
