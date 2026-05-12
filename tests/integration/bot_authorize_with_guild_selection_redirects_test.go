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

func TestBotAuthorizeWithGuildSelectionRedirects(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	guildOwner := createTestAccount(t, client)

	appID, _, _, _ := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Bot Guild Selection %d", time.Now().UnixNano()),
		nil,
		[]string{"bot"},
	)

	guild := createGuild(t, client, guildOwner.Token, fmt.Sprintf("Bot Guild %d", time.Now().UnixNano()))

	payload := map[string]any{
		"client_id": appID,
		"scope":     "bot",
		"guild_id":  guild.ID,
	}

	resp, err := client.postJSONWithAuth("/oauth2/authorize/consent", payload, guildOwner.Token)
	if err != nil {
		t.Fatalf("failed to authorize: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 when selecting guild, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var body struct {
		RedirectTo string `json:"redirect_to"`
	}
	decodeJSONResponse(t, resp, &body)
	if body.RedirectTo == "" {
		t.Fatal("missing redirect_to on consent response")
	}
}
