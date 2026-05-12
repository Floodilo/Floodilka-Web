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

// TestOAuth2TokenExpirationActiveState verifies that tokens are active
// before expiration and properly report their status.
func TestOAuth2TokenExpirationActiveState(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/expire/active"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Active State %d", time.Now().UnixNano()),
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

	introspection := introspectOAuth2Token(t, client, appID, clientSecret, tokens.AccessToken)
	if !introspection.Active {
		t.Fatal("token should be active before expiration")
	}

	userInfo := getOAuth2UserInfo(t, client, tokens.AccessToken)
	if userInfo["sub"] == nil {
		t.Fatal("active token should work for API calls")
	}

	now := time.Now().Unix()
	timeUntilExpiration := introspection.Exp - now

	t.Logf("Token will expire in approximately %d seconds (%d minutes)",
		timeUntilExpiration, timeUntilExpiration/60)

	if timeUntilExpiration < 0 {
		t.Fatal("token appears to be already expired")
	}
}
