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

func TestGuildSplash_ClearSplash(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Splash Test Guild")
	guildID := guild.ID

	grantGuildInviteSplashFeature(t, client, guildID)

	payload := map[string]any{
		"splash": "data:image/png;base64," + getValidPNGBase64(),
	}
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%s", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to set splash: %v", err)
	}
	resp.Body.Close()

	payload = map[string]any{
		"splash": nil,
	}
	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/guilds/%s", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to clear splash: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Splash *string `json:"splash"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Splash != nil {
		t.Error("expected guild splash to be cleared")
	}
}
