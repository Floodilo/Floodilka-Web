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

// TestOAuth2AuthorizeStateParameter verifies that the state parameter is
// correctly echoed back in the authorization redirect.
//
// The state parameter is used to prevent CSRF attacks by allowing the client
// to verify that the authorization response matches the request.
//
// Steps:
// 1. Submit authorization with a specific state value
// 2. Verify the same state value is returned in the redirect
func TestOAuth2AuthorizeStateParameter(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/state/callback"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("State Test App %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify"},
	)

	customState := "my-custom-state-12345"

	authCode, returnedState := authorizeOAuth2(
		t,
		client,
		endUser.Token,
		appID,
		redirectURI,
		[]string{"identify"},
		customState,
		"",
		"",
	)
	if authCode == "" {
		t.Fatal("authorization should return authorization code")
	}

	if returnedState != customState {
		t.Fatalf("expected state %q, got %q", customState, returnedState)
	}

	tokenResp := exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		redirectURI,
		"",
	)
	if tokenResp.AccessToken == "" {
		t.Fatal("token exchange should succeed")
	}
}
