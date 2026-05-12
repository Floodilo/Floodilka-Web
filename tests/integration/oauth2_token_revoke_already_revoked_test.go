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

// TestOAuth2TokenRevokeAlreadyRevoked verifies that revoking an already
// revoked token succeeds (idempotent).
func TestOAuth2TokenRevokeAlreadyRevoked(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/revoke/twice"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Revoke Twice %d", time.Now().UnixNano()),
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

	revokeOAuth2Token(t, client, appID, clientSecret, tokens.AccessToken, "access_token")

	revokeOAuth2Token(t, client, appID, clientSecret, tokens.AccessToken, "access_token")

	introspection := introspectOAuth2Token(t, client, appID, clientSecret, tokens.AccessToken)
	if introspection.Active {
		t.Fatal("token should still be inactive after double revocation")
	}
}
