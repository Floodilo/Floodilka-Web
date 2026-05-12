/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

// TestUnclaimedAccountCanReceiveDM verifies that claimed accounts can send DMs
// to unclaimed accounts.
func TestUnclaimedAccountCanReceiveDM(t *testing.T) {
	client := newTestClient(t)

	claimedAccount := createTestAccount(t, client)
	unclaimedAccount := createTestAccount(t, client)

	guild := createGuild(t, client, claimedAccount.Token, "Test Guild")
	invite := createChannelInvite(t, client, claimedAccount.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, unclaimedAccount.Token, invite.Code)

	unclaimAccount(t, client, unclaimedAccount.UserID)

	resp, err := client.postJSONWithAuth("/users/@me/channels", map[string]string{
		"recipient_id": unclaimedAccount.UserID,
	}, claimedAccount.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM creation: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)
	if channel.ID == "" {
		t.Fatalf("expected channel ID in response")
	}

	t.Log("Unclaimed account can receive DM test passed")
}
