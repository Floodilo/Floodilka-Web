/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

// TestInvalidIDFormats tests handling of malformed IDs
func TestInvalidIDFormats(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	testCases := []struct {
		name     string
		endpoint string
		method   string
	}{
		{"invalid guild ID letters", "/guilds/abcdef", "GET"},
		{"invalid guild ID negative", "/guilds/-123", "GET"},
		{"invalid guild ID overflow", "/guilds/99999999999999999999999999", "GET"},
		{"invalid channel ID", "/channels/invalid/messages", "GET"},
		{"invalid user ID", "/users/notanumber", "GET"},
		{"invalid message ID", "/channels/123/messages/xyz", "GET"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			var resp *http.Response
			var err error

			switch tc.method {
			case "GET":
				resp, err = client.getWithAuth(tc.endpoint, user.Token)
			case "POST":
				resp, err = client.postJSONWithAuth(tc.endpoint, nil, user.Token)
			}

			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusBadRequest && resp.StatusCode != http.StatusNotFound {
				t.Fatalf("expected 400 or 404 for invalid ID, got %d (endpoint: %s)", resp.StatusCode, tc.endpoint)
			}
		})
	}
}
