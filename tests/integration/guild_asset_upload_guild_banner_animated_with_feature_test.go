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

func TestGuildBanner_Animated_WithFeature(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Banner Test Guild")
	guildID := guild.ID

	grantGuildAnimatedBannerFeature(t, client, guildID)

	payload := map[string]any{
		"banner": "data:image/gif;base64," + getValidGIFBase64(),
	}

	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%s", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to update guild banner: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
}
