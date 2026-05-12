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

func TestEmojiUpload_BulkCreate(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Emoji Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	emojis := make([]map[string]any, 5)
	for i := 0; i < 5; i++ {
		emojis[i] = map[string]any{
			"name":  fmt.Sprintf("bulk_emoji_%d", i+1),
			"image": "data:image/png;base64," + getValidPNGBase64(),
		}
	}

	payload := map[string]any{
		"emojis": emojis,
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/emojis/bulk", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to bulk create emojis: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
}
