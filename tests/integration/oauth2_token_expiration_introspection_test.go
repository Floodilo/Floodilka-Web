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

// TestOAuth2TokenExpirationIntrospection verifies that introspection
// correctly reports token expiration status.
func TestOAuth2TokenExpirationIntrospection(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/expire/introspect"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Introspection Exp %d", time.Now().UnixNano()),
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
		t.Fatal("fresh token should be active")
	}
	if introspection.Exp <= 0 {
		t.Fatal("active token introspection should include exp")
	}
	if introspection.Iat <= 0 {
		t.Fatal("active token introspection should include iat (issued at)")
	}

	now := time.Now().Unix()
	if introspection.Iat > now {
		t.Fatalf("iat should be in the past: iat=%d, now=%d", introspection.Iat, now)
	}
	if introspection.Exp <= now {
		t.Fatalf("exp should be in the future: exp=%d, now=%d", introspection.Exp, now)
	}
}
