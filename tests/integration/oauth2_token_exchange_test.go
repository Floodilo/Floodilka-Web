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

// TestOAuth2TokenExchange verifies exchanging an authorization code for tokens.
//
// Steps:
// 1. Get an authorization code
// 2. Exchange it for access token and refresh token
// 3. Verify token response format matches the expected OAuth2 contract
func TestOAuth2TokenExchange(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/token/exchange"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Token Exchange %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify", "email"},
	)

	authCode, _ := authorizeOAuth2(
		t, client,
		endUser.Token,
		appID,
		redirectURI,
		[]string{"identify", "email"},
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

	if tokenResp.AccessToken == "" {
		t.Fatal("access_token is required")
	}
	if tokenResp.TokenType != "Bearer" {
		t.Fatalf("token_type must be 'Bearer', got %q", tokenResp.TokenType)
	}
	if tokenResp.ExpiresIn <= 0 {
		t.Fatalf("expires_in must be positive, got %d", tokenResp.ExpiresIn)
	}
	if tokenResp.RefreshToken == "" {
		t.Fatal("refresh_token is required")
	}
	if tokenResp.Scope != "identify email" {
		t.Fatalf("scope should be 'identify email', got %q", tokenResp.Scope)
	}

	userInfo := getOAuth2UserInfo(t, client, tokenResp.AccessToken)
	if userInfo["sub"] == nil {
		t.Fatal("userinfo must include 'sub'")
	}
}
