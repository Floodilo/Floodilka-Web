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

// TestUnclaimedAccountCanJoinGuildByInvite verifies that unclaimed accounts
// CAN join guilds/communities via invites (unless DISALLOW_UNCLAIMED_ACCOUNTS is set).
func TestUnclaimedAccountCanJoinGuildByInvite(t *testing.T) {
	client := newTestClient(t)

	ownerAccount := createTestAccount(t, client)
	memberAccount := createTestAccount(t, client)

	guild := createGuild(t, client, ownerAccount.Token, "Test Guild")

	invite := createChannelInvite(t, client, ownerAccount.Token, parseSnowflake(t, guild.SystemChannel))

	unclaimAccount(t, client, memberAccount.UserID)

	resp, err := client.postJSONWithAuth("/invites/"+invite.Code, nil, memberAccount.Token)
	if err != nil {
		t.Fatalf("failed to join guild: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for unclaimed account joining guild, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	t.Log("Unclaimed account can join guild by invite test passed")
}
