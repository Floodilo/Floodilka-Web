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

// TestOAuth2AuthorizeMultipleRedirectURIs verifies that an application
// can have multiple registered redirect URIs and use any of them.
func TestOAuth2AuthorizeMultipleRedirectURIs(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	uri1 := "https://app.example.com/callback"
	uri2 := "https://staging.example.com/callback"
	uri3 := "https://localhost:3000/callback"

	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Multiple URIs %d", time.Now().UnixNano()),
		[]string{uri1, uri2, uri3},
		[]string{"identify"},
	)

	uris := []string{uri1, uri2, uri3}
	for i, uri := range uris {
		t.Run(fmt.Sprintf("URI %d", i+1), func(t *testing.T) {
			authCode, _ := authorizeOAuth2(
				t,
				client,
				endUser.Token,
				appID,
				uri,
				[]string{"identify"},
				fmt.Sprintf("state-%d", i),
				"",
				"",
			)

			tokenResp := exchangeOAuth2AuthorizationCode(
				t, client,
				appID,
				clientSecret,
				authCode,
				uri,
				"",
			)
			if tokenResp.AccessToken == "" {
				t.Fatalf("authorization should work with registered URI %s", uri)
			}
		})
	}
}
