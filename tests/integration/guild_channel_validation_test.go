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

func TestGuildChannelValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, "Channel Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	t.Run("reject creating channel without name", func(t *testing.T) {
		payload := map[string]any{"type": 0}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject creating channel with invalid type", func(t *testing.T) {
		payload := map[string]any{"name": "test", "type": 999}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("owner can create text channel", func(t *testing.T) {
		payload := map[string]any{
			"name": fmt.Sprintf("text-%d", time.Now().UnixNano()),
			"type": 0,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to create channel: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var channel struct {
			ID string `json:"id"`
		}
		decodeJSONResponse(t, resp, &channel)
		if channel.ID == "" {
			t.Error("expected channel ID in response")
		}
	})

	t.Run("owner can create voice channel", func(t *testing.T) {
		payload := map[string]any{
			"name": fmt.Sprintf("voice-%d", time.Now().UnixNano()),
			"type": 2,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to create channel: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		resp.Body.Close()
	})

	t.Run("owner can get guild channels", func(t *testing.T) {
		resp, err := client.getWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), owner.Token)
		if err != nil {
			t.Fatalf("failed to get channels: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var channels []struct {
			ID string `json:"id"`
		}
		decodeJSONResponse(t, resp, &channels)
		if len(channels) == 0 {
			t.Error("expected at least one channel")
		}
	})
}
