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

// TestOAuth2TokenRefresh verifies the refresh token flow.
//
// Steps:
// 1. Get initial access token and refresh token
// 2. Use refresh token to get new access token
// 3. Verify new access token works
// 4. Verify new refresh token is issued
func TestOAuth2TokenRefresh(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/refresh/callback"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Refresh Test %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify", "email"},
	)

	authCode, _ := authorizeOAuth2(
		t,
		client,
		endUser.Token,
		appID,
		redirectURI,
		[]string{"identify", "email"},
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

	if initialTokens.RefreshToken == "" {
		t.Fatal("initial token response must include refresh_token")
	}

	refreshedTokens := refreshOAuth2Token(t, client, appID, clientSecret, initialTokens.RefreshToken)

	if refreshedTokens.AccessToken == "" {
		t.Fatal("refresh response must include access_token")
	}
	if refreshedTokens.TokenType != "Bearer" {
		t.Fatalf("token_type should be Bearer, got %s", refreshedTokens.TokenType)
	}
	if refreshedTokens.ExpiresIn <= 0 {
		t.Fatalf("expires_in must be positive, got %d", refreshedTokens.ExpiresIn)
	}
	if refreshedTokens.RefreshToken == "" {
		t.Fatal("refresh response should include new refresh_token")
	}
	if refreshedTokens.Scope != "identify email" {
		t.Fatalf("scope should be preserved as 'identify email', got %q", refreshedTokens.Scope)
	}

	userInfo := getOAuth2UserInfo(t, client, refreshedTokens.AccessToken)
	if userInfo["sub"] == nil {
		t.Fatal("new access token should work for userinfo")
	}
	if userInfo["sub"].(string) != endUser.UserID {
		t.Fatalf("userinfo sub should be %s, got %v", endUser.UserID, userInfo["sub"])
	}

	doubleRefreshed := refreshOAuth2Token(t, client, appID, clientSecret, refreshedTokens.RefreshToken)
	if doubleRefreshed.AccessToken == "" {
		t.Fatal("new refresh token should work")
	}
}
