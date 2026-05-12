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

func TestSticker_MessageValidation_Guild(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Sticker Test Guild")
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

	t.Run("non-existent sticker returns error in guild", func(t *testing.T) {
		payload := map[string]any{
			"content":     "Guild sticker test",
			"sticker_ids": []string{"999999999999999996"},
		}

		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", systemChannelID), payload, user.Token)
		if err != nil {
			t.Fatalf("failed to send message: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			t.Error("expected non-existent sticker to fail in guild")
		}
	})

	t.Run("external sticker fails for non-premium user", func(t *testing.T) {

		payload := map[string]any{
			"content":     "External sticker test",
			"sticker_ids": []string{"888888888888888888"},
		}

		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", systemChannelID), payload, user.Token)
		if err != nil {
			t.Fatalf("failed to send message: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			t.Error("expected external sticker to fail for non-premium user")
		}
	})

	t.Run("sticker limit per message", func(t *testing.T) {
		tooManyStickers := make([]string, 10)
		for i := range tooManyStickers {
			tooManyStickers[i] = fmt.Sprintf("%d", 100000000000000000+i)
		}

		payload := map[string]any{
			"content":     "Too many stickers",
			"sticker_ids": tooManyStickers,
		}

		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", systemChannelID), payload, user.Token)
		if err != nil {
			t.Fatalf("failed to send message: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			t.Error("expected too many stickers to fail")
		}
	})
}
