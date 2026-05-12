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

func TestGuildMemberBanner_Premium_AnimatedGIF(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	grantSubscriptionPremium(t, client, user.UserID)

	guild := createGuild(t, client, user.Token, "Member Banner Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	payload := map[string]any{
		"banner": "data:image/gif;base64," + getValidGIFBase64(),
	}

	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d/members/@me", guildID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to update guild member banner: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
}
