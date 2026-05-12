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

// TestOAuth2AuthorizeRedirectURIExactMatch verifies that redirect URIs
// must match exactly (no partial matches).
func TestOAuth2AuthorizeRedirectURIExactMatch(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	registeredURI := "https://example.com/callback"

	appID, _, _, _ := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Exact Match %d", time.Now().UnixNano()),
		[]string{registeredURI},
		[]string{"identify"},
	)

	testCases := []struct {
		name        string
		redirectURI string
	}{
		{"with extra path", "https://example.com/callback/extra"},
		{"with query param", "https://example.com/callback?foo=bar"},
		{"with fragment", "https://example.com/callback#fragment"},
		{"different scheme", "http://example.com/callback"},
		{"different host", "https://other.com/callback"},
		{"different port", "https://example.com:8080/callback"},
		{"trailing slash", "https://example.com/callback/"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			resp, err := client.postJSONWithAuth("/oauth2/authorize/consent", map[string]any{
				"response_type": "code",
				"client_id":     appID,
				"redirect_uri":  tc.redirectURI,
				"scope":         "identify",
				"state":         "test-state",
			}, endUser.Token)
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			if resp.Body != nil {
				resp.Body.Close()
			}

			if resp.StatusCode == http.StatusOK {
				t.Fatalf("should not accept non-registered redirect URI %s", tc.redirectURI)
			}
		})
	}
}
