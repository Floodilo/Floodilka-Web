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

func createGuildEmoji(t testing.TB, client *testClient, token string, guildID int64, name string) emojiResponse {
	t.Helper()

	image := loadFixtureAsDataURL(t, "yeah.png", "image/png")

	payload := map[string]any{
		"name":  name,
		"image": image,
	}

	resp, err := client.postJSONWithAuth(
		fmt.Sprintf("/guilds/%d/emojis", guildID),
		payload,
		token,
	)
	if err != nil {
		t.Fatalf("failed to create emoji: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 or 201, got %d", resp.StatusCode)
	}

	var emoji emojiResponse
	decodeJSONResponse(t, resp, &emoji)
	return emoji
}
