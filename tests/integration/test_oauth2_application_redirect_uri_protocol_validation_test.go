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

// TestOAuth2ApplicationRedirectURIProtocolValidation ensures redirect URI validation enforces safe schemes.
func TestOAuth2ApplicationRedirectURIProtocolValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	allowed := []string{
		"https://example.com/callback",
		"http://localhost:8080/callback",
		"http://127.0.0.1/callback",
		"http://[::1]/callback",
		"http://foo.localhost/callback",
	}

	for _, redirect := range allowed {
		t.Run(fmt.Sprintf("accepts %s", redirect), func(t *testing.T) {
			resp, err := client.postJSONWithAuth("/oauth2/applications", map[string]any{
				"name":          fmt.Sprintf("Allowed Redirect %d", time.Now().UnixNano()),
				"redirect_uris": []string{redirect},
			}, owner.Token)
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				t.Fatalf("expected status %d, got %d: %s", http.StatusOK, resp.StatusCode, readResponseBody(resp))
			}
		})
	}

	disallowed := []struct {
		name string
		uri  string
	}{
		{name: "javascript", uri: "javascript://example.com/%0Aalert(document.cookie)"},
		{name: "data", uri: "data://example.com/text"},
		{name: "file", uri: "file://example.com/etc/passwd"},
		{name: "vbscript", uri: "vbscript://example.com/code"},
		{name: "ftp", uri: "ftp://example.com/file"},
		{name: "ws", uri: "ws://example.com/socket"},
		{name: "wss", uri: "wss://example.com/socket"},
		{name: "custom", uri: "custom://example.com/path"},
	}

	for _, tt := range disallowed {
		t.Run(fmt.Sprintf("rejects %s", tt.name), func(t *testing.T) {
			resp, err := client.postJSONWithAuth("/oauth2/applications", map[string]any{
				"name":          fmt.Sprintf("Disallowed Redirect %s", tt.name),
				"redirect_uris": []string{tt.uri},
			}, owner.Token)
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusBadRequest {
				t.Fatalf("expected status %d, got %d: %s", http.StatusBadRequest, resp.StatusCode, readResponseBody(resp))
			}
		})
	}
}
