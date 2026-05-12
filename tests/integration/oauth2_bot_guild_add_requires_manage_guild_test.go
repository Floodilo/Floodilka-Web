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
	"time"
)

func TestOAuth2BotGuildAddRequiresManageGuild(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	guildOwner := createTestAccount(t, client)
	regularUser := createTestAccount(t, client)

	guild := createGuild(t, client, guildOwner.Token, fmt.Sprintf("Bot Guild Restricted %d", time.Now().UnixNano()))

	appID, _, _ := createOAuth2BotApplication(t, client, appOwner, fmt.Sprintf("Bot Add Restricted %d", time.Now().UnixNano()), nil)

	payload := map[string]any{
		"client_id": appID,
		"scope":     "bot",
		"guild_id":  guild.ID,
	}

	resp, err := client.postJSONWithAuth("/oauth2/authorize/consent", payload, regularUser.Token)
	if err != nil {
		t.Fatalf("failed to attempt bot authorization: %v", err)
	}

	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected authorization to fail for user without manage guild, got %d", resp.StatusCode)
	}
}
