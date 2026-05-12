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

// TestOAuth2AuthorizeLocalhostRedirectURI verifies that localhost URIs
// work correctly for development purposes.
func TestOAuth2AuthorizeLocalhostRedirectURI(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	localhostURI := "http://localhost:8080/oauth/callback"

	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Localhost URI %d", time.Now().UnixNano()),
		[]string{localhostURI},
		[]string{"identify"},
	)

	authCode, _ := authorizeOAuth2(
		t,
		client,
		endUser.Token,
		appID,
		localhostURI,
		[]string{"identify"},
		"localhost-state",
		"",
		"",
	)

	tokenResp := exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		localhostURI,
		"",
	)
	if tokenResp.AccessToken == "" {
		t.Fatal("authorization should work with localhost redirect_uri")
	}
}
