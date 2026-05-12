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

func TestGuildIcon_OnCreate(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	payload := map[string]any{
		"name": "Guild With Icon",
		"icon": "data:image/png;base64," + getValidPNGBase64(),
	}

	resp, err := client.postJSONWithAuth("/guilds", payload, user.Token)
	if err != nil {
		t.Fatalf("failed to create guild with icon: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var guild struct {
		ID   string `json:"id"`
		Icon string `json:"icon"`
	}
	decodeJSONResponse(t, resp, &guild)

	if guild.Icon == "" {
		t.Error("expected guild to have icon set on creation")
	}
}
