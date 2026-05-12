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

func TestWebhook_EmojiBypas(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Webhook Emoji Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	emoji := createGuildEmoji(t, client, user.Token, guildID, "external")
	animatedEmoji := createGuildEmojiWithFile(t, client, user.Token, guildID, "animated", "thisisfine.gif", "image/gif")
	waitEmoji := createGuildEmoji(t, client, user.Token, guildID, "wait_emoji")

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

	webhookPayload := map[string]any{
		"name": "Emoji Test Webhook",
	}

	webhookResp, err := client.postJSONWithAuth(
		fmt.Sprintf("/channels/%d/webhooks", systemChannelID),
		webhookPayload,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to create webhook: %v", err)
	}
	defer webhookResp.Body.Close()
	assertStatus(t, webhookResp, http.StatusOK)

	var webhook struct {
		ID    string `json:"id"`
		Token string `json:"token"`
	}
	decodeJSONResponse(t, webhookResp, &webhook)

	t.Run("webhook can use external emoji without sanitization", func(t *testing.T) {
		messagePayload := map[string]any{
			"content": fmt.Sprintf("Webhook message <:external:%s> <a:animated:%s>", emoji.ID, animatedEmoji.ID),
		}

		executeResp, err := client.postJSON(
			fmt.Sprintf("/webhooks/%s/%s", webhook.ID, webhook.Token),
			messagePayload,
		)
		if err != nil {
			t.Fatalf("failed to execute webhook: %v", err)
		}
		defer executeResp.Body.Close()

		if executeResp.StatusCode != http.StatusOK && executeResp.StatusCode != http.StatusNoContent {
			t.Errorf("expected webhook to succeed, got %d", executeResp.StatusCode)
		}

		if executeResp.StatusCode == http.StatusOK {
			var msg struct {
				Content string `json:"content"`
			}
			decodeJSONResponse(t, executeResp, &msg)

			if !strings.Contains(msg.Content, "<:external:") {
				t.Error("expected webhook to preserve emoji format, but emoji was sanitized")
			}
			if !strings.Contains(msg.Content, "<a:animated:") {
				t.Error("expected webhook to preserve animated emoji format, but emoji was sanitized")
			}
		}
	})

	t.Run("webhook can use non-existent emoji", func(t *testing.T) {
		messagePayload := map[string]any{
			"content": "Fake emoji <:doesnotexist:123456789012345678>",
		}

		executeResp, err := client.postJSON(
			fmt.Sprintf("/webhooks/%s/%s", webhook.ID, webhook.Token),
			messagePayload,
		)
		if err != nil {
			t.Fatalf("failed to execute webhook: %v", err)
		}
		defer executeResp.Body.Close()

		if executeResp.StatusCode != http.StatusOK && executeResp.StatusCode != http.StatusNoContent {
			t.Errorf("expected webhook with fake emoji to succeed, got %d", executeResp.StatusCode)
		}
	})

	t.Run("webhook emoji in code block", func(t *testing.T) {
		messagePayload := map[string]any{
			"content": "Code: `<:code_emoji:111111111111111111>`",
		}

		executeResp, err := client.postJSON(
			fmt.Sprintf("/webhooks/%s/%s", webhook.ID, webhook.Token),
			messagePayload,
		)
		if err != nil {
			t.Fatalf("failed to execute webhook: %v", err)
		}
		defer executeResp.Body.Close()

		if executeResp.StatusCode != http.StatusOK && executeResp.StatusCode != http.StatusNoContent {
			t.Errorf("expected webhook to succeed, got %d", executeResp.StatusCode)
		}
	})

	t.Run("webhook wait parameter returns message", func(t *testing.T) {
		messagePayload := map[string]any{
			"content": fmt.Sprintf("Wait test <:wait_emoji:%s>", waitEmoji.ID),
		}

		executeResp, err := client.postJSON(
			fmt.Sprintf("/webhooks/%s/%s?wait=true", webhook.ID, webhook.Token),
			messagePayload,
		)
		if err != nil {
			t.Fatalf("failed to execute webhook: %v", err)
		}
		defer executeResp.Body.Close()
		assertStatus(t, executeResp, http.StatusOK)

		var msg struct {
			ID      string `json:"id"`
			Content string `json:"content"`
		}
		decodeJSONResponse(t, executeResp, &msg)

		if msg.ID == "" {
			t.Error("expected message ID with wait=true")
		}

		if !strings.Contains(msg.Content, "<:wait_emoji:") {
			t.Error("expected webhook to preserve emoji format with wait=true")
		}
	})
}
