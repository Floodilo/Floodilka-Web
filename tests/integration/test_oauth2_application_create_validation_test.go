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

// TestOAuth2ApplicationCreateValidation validates input validation for application creation.
func TestOAuth2ApplicationCreateValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	tests := []struct {
		name           string
		payload        map[string]any
		expectedStatus int
		description    string
	}{
		{
			name:           "missing name",
			payload:        map[string]any{},
			expectedStatus: http.StatusBadRequest,
			description:    "name is required",
		},
		{
			name: "non-localhost http redirect URI rejected",
			payload: map[string]any{
				"name":          "Test App",
				"redirect_uris": []string{"http://example.com/callback"},
			},
			expectedStatus: http.StatusBadRequest,
			description:    "non-localhost http redirect URIs must be disallowed",
		},
		{
			name: "https redirect URI accepted",
			payload: map[string]any{
				"name":          fmt.Sprintf("HTTPS App %d", time.Now().UnixNano()),
				"redirect_uris": []string{"https://example.com/callback"},
			},
			expectedStatus: http.StatusOK,
			description:    "https redirect URIs are allowed",
		},
		{
			name: "localhost redirect URI allowed",
			payload: map[string]any{
				"name":          fmt.Sprintf("Localhost App %d", time.Now().UnixNano()),
				"redirect_uris": []string{"http://localhost:3000/callback"},
			},
			expectedStatus: http.StatusOK,
			description:    "localhost redirect URIs are allowed with http",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := client.postJSONWithAuth("/oauth2/applications", tt.payload, owner.Token)
			if err != nil {
				t.Fatalf("request failed: %v", err)
			}
			defer resp.Body.Close()

			if resp.StatusCode != tt.expectedStatus {
				t.Fatalf("%s: expected status %d, got %d: %s", tt.description, tt.expectedStatus, resp.StatusCode, readResponseBody(resp))
			}
		})
	}
}
