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

func TestGuildChannelPositions(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, "Position Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	ch1Payload := map[string]any{"name": "channel-1", "type": 0}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), ch1Payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to create channel 1: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var ch1 struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &ch1)

	ch2Payload := map[string]any{"name": "channel-2", "type": 0}
	resp, err = client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), ch2Payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to create channel 2: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var ch2 struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &ch2)

	t.Run("owner can update channel positions", func(t *testing.T) {
		positions := []map[string]any{
			{"id": ch1.ID, "position": 1},
			{"id": ch2.ID, "position": 0},
		}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), positions, owner.Token)
		if err != nil {
			t.Fatalf("failed to update positions: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})
}
