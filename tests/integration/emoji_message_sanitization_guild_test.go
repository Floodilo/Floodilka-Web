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
	"strings"
	"testing"
)

func TestEmoji_MessageSanitization_Guild(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Emoji Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	resp, err := client.getWithAuth(fmt.Sprintf("/guilds/%d", guildID), user.Token)
	if err != nil {
		t.Fatalf("failed to get guild: %v", err)
	}
	var guildData struct {
		SystemChannelID string `json:"system_channel_id"`
	}
	decodeJSONResponse(t, resp, &guildData)
	resp.Body.Close()
	systemChannelID := parseSnowflake(t, guildData.SystemChannelID)

	t.Run("external emoji replaced for non-premium in guild", func(t *testing.T) {
		content := "Guild message <:external:999999999999999997>"

		msg := sendChannelMessage(t, client, user.Token, systemChannelID, content)

		fetchResp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", systemChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer fetchResp.Body.Close()
		assertStatus(t, fetchResp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, fetchResp, &result)

		if strings.Contains(result.Content, "<:external:") {
			t.Error("expected external emoji to be sanitized for non-premium user in guild")
		}
	})

	t.Run("multiple emojis sanitized individually", func(t *testing.T) {
		content := "Start <:one:111> middle <:two:222> end <:three:333>"

		msg := sendChannelMessage(t, client, user.Token, systemChannelID, content)

		fetchResp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", systemChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer fetchResp.Body.Close()
		assertStatus(t, fetchResp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, fetchResp, &result)

		t.Logf("Multi-emoji result: %s", result.Content)

		if strings.Contains(result.Content, "<:one:") ||
			strings.Contains(result.Content, "<:two:") ||
			strings.Contains(result.Content, "<:three:") {
			t.Error("expected all external emojis to be sanitized")
		}
	})
}
