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

// TestOAuth2TokenExpirationMultipleScopes verifies that expiration handling
// is consistent across different scope configurations.
func TestOAuth2TokenExpirationMultipleScopes(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/expire/scopes"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Scopes Exp %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify", "email", "guilds"},
	)

	testCases := []struct {
		name   string
		scopes []string
	}{
		{"single scope", []string{"identify"}},
		{"two scopes", []string{"identify", "email"}},
		{"three scopes", []string{"identify", "email", "guilds"}},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			authCode, _ := authorizeOAuth2(
				t,
				client,
				endUser.Token,
				appID,
				redirectURI,
				tc.scopes,
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

			if tokens.ExpiresIn <= 0 {
				t.Fatalf("expires_in must be positive for scopes %v", tc.scopes)
			}

			introspection := introspectOAuth2Token(t, client, appID, clientSecret, tokens.AccessToken)
			if !introspection.Active {
				t.Fatalf("token should be active for scopes %v", tc.scopes)
			}
			if introspection.Exp <= time.Now().Unix() {
				t.Fatalf("exp should be in future for scopes %v", tc.scopes)
			}
		})
	}
}
