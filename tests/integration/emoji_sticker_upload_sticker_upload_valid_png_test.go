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

func TestStickerUpload_ValidPNG(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Sticker Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	payload := map[string]any{
		"name":        "test_sticker",
		"description": "A test sticker",
		"tags":        []string{"test", "sticker"},
		"image":       "data:image/png;base64," + getValidPNGBase64(),
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/stickers", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to create sticker: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var sticker struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}
	decodeJSONResponse(t, resp, &sticker)

	if sticker.Name != "test_sticker" {
		t.Errorf("expected sticker name 'test_sticker', got '%s'", sticker.Name)
	}
}
