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

func TestGuildSplash_NoFeature(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(
		t,
		client,
		user.Token,
		"Splash Test Guild",
		map[string]any{"empty_features": true},
	)
	guildID := parseSnowflake(t, guild.ID)

	payload := map[string]any{
		"splash": "data:image/png;base64," + getValidPNGBase64(),
	}

	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		var result struct {
			Splash *string `json:"splash"`
		}
		decodeJSONResponse(t, resp, &result)
		if result.Splash != nil && *result.Splash != "" {
			t.Error("expected splash to be rejected without INVITE_SPLASH feature")
		}
	}
}
