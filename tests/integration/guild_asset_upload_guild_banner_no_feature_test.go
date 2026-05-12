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

func TestGuildBanner_NoFeature(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(
		t,
		client,
		user.Token,
		"Banner Test Guild",
		map[string]any{"empty_features": true},
	)
	guildID := parseSnowflake(t, guild.ID)

	payload := map[string]any{
		"banner": "data:image/png;base64," + getValidPNGBase64(),
	}

	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d", guildID), payload, user.Token)
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
			t.Error("expected banner to be rejected without BANNER feature")
		}
	}
}
