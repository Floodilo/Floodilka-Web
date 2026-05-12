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

// TestOAuth2ApplicationUpdateValidation validates input validation during updates.
func TestOAuth2ApplicationUpdateValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Validation Test %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}
	appID, _, _ := createOAuth2BotApplication(t, client, owner, name, redirectURIs)

	tests := []struct {
		name           string
		updates        map[string]any
		expectedStatus int
		description    string
	}{
		{
			name: "invalid redirect URI scheme",
			updates: map[string]any{
				"redirect_uris": []string{"http://example.com/callback"},
			},
			expectedStatus: http.StatusOK,
			description:    "http URIs are allowed",
		},
		{
			name: "empty redirect URIs array",
			updates: map[string]any{
				"redirect_uris": []string{},
			},
			expectedStatus: http.StatusOK,
			description:    "redirect_uris may be empty",
		},
		{
			name: "localhost redirect URI allowed",
			updates: map[string]any{
				"redirect_uris": []string{"http://localhost:8080/callback"},
			},
			expectedStatus: http.StatusOK,
			description:    "localhost with http should be allowed",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := client.patchJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", appID), tt.updates, owner.Token)
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
