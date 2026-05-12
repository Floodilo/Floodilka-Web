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
	"testing"
	"time"
)

// TestOAuth2AuthorizationsListAfterConsent verifies that after a user
// authorizes an OAuth2 application, it appears in their authorizations list.
func TestOAuth2AuthorizationsListAfterConsent(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/authz/callback"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Auth List Test %d", time.Now().UnixNano()),
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

	exchangeOAuth2AuthorizationCode(
		t, client,
		appID,
		clientSecret,
		authCode,
		redirectURI,
		"",
	)

	resp, err := client.getWithAuth("/oauth2/@me/authorizations", endUser.Token)
	if err != nil {
		t.Fatalf("failed to list authorizations: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list authorizations failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var authorizations []oauth2AuthorizationResponse
	decodeJSONResponse(t, resp, &authorizations)

	if len(authorizations) != 1 {
		t.Fatalf("expected 1 authorization, got %d", len(authorizations))
	}

	authz := authorizations[0]
	if authz.Application.ID != appID {
		t.Fatalf("expected application ID %s, got %s", appID, authz.Application.ID)
	}

	hasIdentify := false
	hasEmail := false
	for _, scope := range authz.Scopes {
		if scope == "identify" {
			hasIdentify = true
		}
		if scope == "email" {
			hasEmail = true
		}
		if scope == "bot" {
			t.Fatal("authorizations list should not include bot-only scopes")
		}
	}
	if !hasIdentify || !hasEmail {
		t.Fatalf("expected identify and email scopes, got %v", authz.Scopes)
	}

	if authz.AuthorizedAt == "" {
		t.Fatal("authorized_at should not be empty")
	}
}
