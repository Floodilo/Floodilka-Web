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

// TestUnclaimedAccountCannotSendDM verifies that unclaimed accounts
// cannot send direct messages even if they share mutual guilds with the target user.
func TestUnclaimedAccountCannotSendDM(t *testing.T) {
	client := newTestClient(t)

	unclaimedAccount := createTestAccount(t, client)
	targetAccount := createTestAccount(t, client)

	guild := createGuild(t, client, unclaimedAccount.Token, "Test Guild")
	invite := createChannelInvite(t, client, unclaimedAccount.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, targetAccount.Token, invite.Code)

	unclaimAccount(t, client, unclaimedAccount.UserID)

	resp, err := client.postJSONWithAuth("/users/@me/channels", map[string]string{
		"recipient_id": targetAccount.UserID,
	}, unclaimedAccount.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM creation: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for unclaimed account DM creation, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	// Verify the error code is UNCLAIMED_ACCOUNT_RESTRICTED
	var errorResp struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
		t.Fatalf("failed to decode error response: %v", err)
	}

	if errorResp.Code != "UNCLAIMED_ACCOUNT_RESTRICTED" {
		t.Fatalf("expected error code UNCLAIMED_ACCOUNT_RESTRICTED, got %s", errorResp.Code)
	}

	t.Log("Unclaimed account cannot send DM test passed")
}
