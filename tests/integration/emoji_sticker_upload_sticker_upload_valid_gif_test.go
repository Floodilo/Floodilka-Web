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

func TestStickerUpload_ValidGIF(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Sticker Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	payload := map[string]any{
		"name":  "animated_sticker",
		"image": "data:image/gif;base64," + getValidGIFBase64(),
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/stickers", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to create sticker: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
}
