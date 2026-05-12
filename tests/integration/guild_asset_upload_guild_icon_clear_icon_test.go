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

func TestGuildIcon_ClearIcon(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Icon Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	payload := map[string]any{
		"icon": "data:image/png;base64," + getValidPNGBase64(),
	}
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to set icon: %v", err)
	}
	resp.Body.Close()

	payload = map[string]any{
		"icon": nil,
	}
	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to clear icon: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Icon *string `json:"icon"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Icon != nil {
		t.Error("expected guild icon to be cleared")
	}
}
