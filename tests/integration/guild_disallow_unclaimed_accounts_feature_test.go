/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

// TestGuildDisallowUnclaimedAccountsFeature verifies that guilds with the
// DISALLOW_UNCLAIMED_ACCOUNTS feature block unclaimed accounts from joining.
func TestGuildDisallowUnclaimedAccountsFeature(t *testing.T) {
	client := newTestClient(t)

	ownerAccount := createTestAccount(t, client)
	memberAccount := createTestAccount(t, client)

	guild := createGuild(t, client, ownerAccount.Token, "Protected Guild")

	resp, err := client.patchJSONWithAuth(
		"/guilds/"+guild.ID+"/disallow-unclaimed-accounts",
		map[string]bool{"enabled": true},
		ownerAccount.Token,
	)
	if err != nil {
		t.Fatalf("failed to enable DISALLOW_UNCLAIMED_ACCOUNTS: %v", err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("failed to enable feature, got status %d", resp.StatusCode)
	}

	invite := createChannelInvite(t, client, ownerAccount.Token, parseSnowflake(t, guild.SystemChannel))

	unclaimAccount(t, client, memberAccount.UserID)

	resp, err = client.postJSONWithAuth("/invites/"+invite.Code, nil, memberAccount.Token)
	if err != nil {
		t.Fatalf("failed to attempt guild join: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for unclaimed account joining protected guild, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	// Verify the error code
	var errorResp struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
		t.Fatalf("failed to decode error response: %v", err)
	}

	if errorResp.Code != "GUILD_DISALLOWS_UNCLAIMED_ACCOUNTS" {
		t.Fatalf("expected error code GUILD_DISALLOWS_UNCLAIMED_ACCOUNTS, got %s", errorResp.Code)
	}

	t.Log("Guild DISALLOW_UNCLAIMED_ACCOUNTS feature test passed")
}
