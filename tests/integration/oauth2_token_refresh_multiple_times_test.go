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

// TestOAuth2TokenRefreshMultipleTimes verifies that refresh tokens can be
// used multiple times in sequence (refresh rotation).
func TestOAuth2TokenRefreshMultipleTimes(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/refresh/multiple"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Multiple Refresh %d", time.Now().UnixNano()),
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

	currentRefreshToken := tokens.RefreshToken
	for i := 0; i < 3; i++ {
		t.Logf("Refresh iteration %d", i+1)

		refreshed := refreshOAuth2Token(t, client, appID, clientSecret, currentRefreshToken)
		if refreshed.AccessToken == "" {
			t.Fatalf("refresh %d failed to return access token", i+1)
		}
		if refreshed.RefreshToken == "" {
			t.Fatalf("refresh %d failed to return new refresh token", i+1)
		}

		userInfo := getOAuth2UserInfo(t, client, refreshed.AccessToken)
		if userInfo["sub"] == nil {
			t.Fatalf("access token from refresh %d should work", i+1)
		}

		currentRefreshToken = refreshed.RefreshToken
	}
}
