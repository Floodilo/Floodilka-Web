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

// TestUserSettingsValidation checks type validation and value bounds on the settings endpoint
func TestUserSettingsValidation(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	testCases := []struct {
		name    string
		payload any
	}{
		{name: "boolean fields must be booleans", payload: map[string]any{"inline_attachment_media": "true"}},
		{name: "status must be known string", payload: map[string]any{"status": 42}},
		{name: "null theme not allowed", payload: map[string]any{"theme": nil}},
		{name: "mixed invalid shape", payload: map[string]any{"status": "offline", "gif_auto_play": "nope"}},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			resp, err := client.patchJSONWithAuth("/users/@me/settings", tc.payload, user.Token)
			if err != nil {
				t.Fatalf("failed to call settings endpoint: %v", err)
			}
			if resp.StatusCode == http.StatusOK {
				t.Fatalf("expected validation failure for %s, got 200", tc.name)
			}
			resp.Body.Close()
		})
	}

	validPayload := map[string]any{
		"status":                  "online",
		"inline_attachment_media": true,
		"gif_auto_play":           false,
	}
	resp, err := client.patchJSONWithAuth("/users/@me/settings", validPayload, user.Token)
	if err != nil {
		t.Fatalf("failed to apply valid settings update: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()
}
