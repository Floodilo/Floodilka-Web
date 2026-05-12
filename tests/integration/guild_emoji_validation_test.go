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

func TestGuildEmojiValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	guild := createGuild(t, client, owner.Token, "Emoji Validation Guild")
	guildID := parseSnowflake(t, guild.ID)

	t.Run("reject emoji with missing name", func(t *testing.T) {
		emojiImage := loadFixtureAsDataURL(t, "yeah.png", "image/png")
		payload := map[string]string{
			"image": emojiImage,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/emojis", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject emoji with missing image", func(t *testing.T) {
		payload := map[string]string{
			"name": "testmoji",
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/emojis", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject emoji name too long", func(t *testing.T) {
		emojiImage := loadFixtureAsDataURL(t, "yeah.png", "image/png")
		payload := map[string]string{
			"name":  "verylongemojinamethatexceedsthemaximumlengthallowedbytheapi",
			"image": emojiImage,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/emojis", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject invalid image data", func(t *testing.T) {
		payload := map[string]string{
			"name":  "testmoji",
			"image": "invalid-base64-data",
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/emojis", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("update nonexistent emoji returns 404", func(t *testing.T) {
		payload := map[string]string{"name": "newname"}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d/emojis/999999999999999999", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("delete nonexistent emoji returns 404", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/guilds/%d/emojis/999999999999999999", guildID), owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})
}
