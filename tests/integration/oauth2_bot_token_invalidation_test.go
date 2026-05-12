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
)

// TestBotTokenInvalidation verifies that invalid or malformed bot tokens are rejected.
func TestBotTokenInvalidation(t *testing.T) {
	client := newTestClient(t)

	testCases := []struct {
		name  string
		token string
	}{
		{"empty token", ""},
		{"invalid format", "not-a-real-token"},
		{"random string", "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAuR0ZVa2Ry.dQw4w9WgXcQ"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/@me", client.baseURL), nil)
			if err != nil {
				t.Fatalf("failed to build request: %v", err)
			}
			req.Header.Set("Authorization", fmt.Sprintf("Bot %s", tc.token))
			client.applyCommonHeaders(req)

			resp, err := client.httpClient.Do(req)
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusUnauthorized {
				t.Fatalf("expected 401 for invalid token %q, got %d", tc.name, resp.StatusCode)
			}
		})
	}

	t.Logf("All invalid bot tokens correctly rejected")
}
