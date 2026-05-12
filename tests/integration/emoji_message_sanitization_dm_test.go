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

func TestEmoji_MessageSanitization_DM(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	createFriendship(t, client, user, user2)
	dmChannel := createDmChannel(t, client, user.Token, parseSnowflake(t, user2.UserID))
	dmChannelID := parseSnowflake(t, dmChannel.ID)

	t.Run("non-premium user has external emoji replaced with name", func(t *testing.T) {
		content := "Hello <:external_emoji:999999999999999999>"

		msg := sendChannelMessage(t, client, user.Token, dmChannelID, content)

		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", dmChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, resp, &result)

		if strings.Contains(result.Content, "<:external_emoji:") {
			t.Error("expected custom emoji to be sanitized for non-premium user in DM")
		}

		if !strings.Contains(result.Content, ":external_emoji:") {
			t.Error("expected emoji to be replaced with :name: format")
		}
	})

	t.Run("non-premium user animated emoji replaced with name", func(t *testing.T) {
		content := "Animated <a:dance:999999999999999999>"

		msg := sendChannelMessage(t, client, user.Token, dmChannelID, content)

		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", dmChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, resp, &result)

		if strings.Contains(result.Content, "<a:dance:") {
			t.Error("expected animated emoji to be sanitized for non-premium user")
		}
	})

	t.Run("premium user can use external emoji in DM", func(t *testing.T) {
		premiumUser := createTestAccount(t, client)
		ensureSessionStarted(t, client, premiumUser.Token)
		grantPremium(t, client, premiumUser.UserID, PremiumTypeSubscription)

		guild := createGuild(t, client, premiumUser.Token, "Emoji Guild")
		guildID := parseSnowflake(t, guild.ID)
		emoji := createGuildEmoji(t, client, premiumUser.Token, guildID, "premium_emoji")

		createFriendship(t, client, premiumUser, user2)
		premiumDM := createDmChannel(t, client, premiumUser.Token, parseSnowflake(t, user2.UserID))
		premiumDMID := parseSnowflake(t, premiumDM.ID)

		content := fmt.Sprintf("Premium test <:premium_emoji:%s>", emoji.ID)
		msg := sendChannelMessage(t, client, premiumUser.Token, premiumDMID, content)

		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", premiumDMID, msg.ID), premiumUser.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, resp, &result)

		if !strings.Contains(result.Content, "<:premium_emoji:") {
			t.Errorf("expected premium user message to contain custom emoji, got: %s", result.Content)
		}
	})

	t.Run("emoji in code block preserved", func(t *testing.T) {
		content := "Look at this: `<:code_emoji:123456789>`"

		msg := sendChannelMessage(t, client, user.Token, dmChannelID, content)

		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", dmChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, resp, &result)

		if !strings.Contains(result.Content, "`<:code_emoji:123456789>`") {
			t.Error("expected emoji in code block to be preserved")
		}
	})

	t.Run("emoji in triple backtick code block preserved", func(t *testing.T) {
		content := "```\n<:block_emoji:123456789>\n```"

		msg := sendChannelMessage(t, client, user.Token, dmChannelID, content)

		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", dmChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, resp, &result)

		if !strings.Contains(result.Content, "<:block_emoji:123456789>") {
			t.Error("expected emoji in code block to be preserved")
		}
	})

	t.Run("unicode emoji allowed", func(t *testing.T) {
		content := "Hello 👋 world 🌍"

		msg := sendChannelMessage(t, client, user.Token, dmChannelID, content)

		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%s", dmChannelID, msg.ID), user.Token)
		if err != nil {
			t.Fatalf("failed to fetch message: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var result struct {
			Content string `json:"content"`
		}
		decodeJSONResponse(t, resp, &result)

		if !strings.Contains(result.Content, "👋") {
			t.Error("expected unicode emoji to be preserved")
		}
	})
}
