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

func TestUserBanner_NonPremium(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	payload := map[string]any{
		"banner": "data:image/png;base64," + getValidPNGBase64(),
	}

	resp, err := client.patchJSONWithAuth("/users/@me", payload, user.Token)
	if err != nil {
		t.Fatalf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		var result struct {
			Banner *string `json:"banner"`
		}
		decodeJSONResponse(t, resp, &result)
		if result.Banner != nil && *result.Banner != "" {
			t.Error("expected banner to be rejected for non-premium user")
		}
	}
}
