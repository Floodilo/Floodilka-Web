/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
)

// TestUnclaimedAccountCannotSendGuildMessage verifies that unclaimed accounts
// cannot send messages in guild channels.
func TestUnclaimedAccountCannotSendGuildMessage(t *testing.T) {
	client := newTestClient(t)

	ownerAccount := createTestAccount(t, client)
	memberAccount := createTestAccount(t, client)

	guild := createGuild(t, client, ownerAccount.Token, "Test Guild")

	invite := createChannelInvite(t, client, ownerAccount.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, memberAccount.Token, invite.Code)

	unclaimAccount(t, client, memberAccount.UserID)

	resp, err := client.postJSONWithAuth(
		fmt.Sprintf("/channels/%s/messages", guild.SystemChannel),
		map[string]string{"content": "Hello world"},
		memberAccount.Token,
	)
	if err != nil {
		t.Fatalf("failed to attempt message send: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for unclaimed account sending guild message, got %d: %s", resp.StatusCode, readResponseBody(resp))
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

	t.Log("Unclaimed account cannot send guild message test passed")
}
