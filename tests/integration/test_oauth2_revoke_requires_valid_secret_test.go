/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"net/url"
	"testing"
	"time"
)

// TestOAuth2RevokeRequiresValidSecret verifies token revocation for confidential
// applications requires valid client authentication.
func TestOAuth2RevokeRequiresValidSecret(t *testing.T) {
	t.Parallel()

	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/revoke/secret-check"
	appID, _, _, clientSecret := createOAuth2Application(
		t,
		client,
		appOwner,
		fmt.Sprintf("Revoke Secret Check %d", time.Now().UnixNano()),
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
	tokens := exchangeOAuth2AuthorizationCode(t, client, appID, clientSecret, authCode, redirectURI, "")

	t.Run("reject invalid client secret on revoke", func(t *testing.T) {
		form := url.Values{
			"token":           {tokens.AccessToken},
			"token_type_hint": {"access_token"},
			"client_id":       {appID},
			"client_secret":   {"not-the-secret"},
		}
		resp, err := client.postForm("/oauth2/token/revoke", form, "")
		if err != nil {
			t.Fatalf("failed to call revoke: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			t.Fatalf("revoke should fail with invalid client_secret")
		}
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401 for invalid client_secret, got %d", resp.StatusCode)
		}
	})

	t.Run("reject missing client auth on revoke", func(t *testing.T) {
		form := url.Values{
			"token":           {tokens.AccessToken},
			"token_type_hint": {"access_token"},
			"client_id":       {appID},
		}
		resp, err := client.postForm("/oauth2/token/revoke", form, "")
		if err != nil {
			t.Fatalf("failed to call revoke: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			t.Fatalf("revoke should fail when client authentication is missing")
		}
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401 for missing client authentication, got %d", resp.StatusCode)
		}
	})
}
