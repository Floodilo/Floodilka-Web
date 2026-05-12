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
	"net/url"
	"testing"
)

// TestUnclaimedAccountCannotAddReaction verifies that unclaimed accounts
// cannot add reactions to messages in guild channels.
func TestUnclaimedAccountCannotAddReaction(t *testing.T) {
	client := newTestClient(t)

	ownerAccount := createTestAccount(t, client)
	memberAccount := createTestAccount(t, client)

	guild := createGuild(t, client, ownerAccount.Token, "Test Guild")

	channelID := parseSnowflake(t, guild.SystemChannel)
	invite := createChannelInvite(t, client, ownerAccount.Token, channelID)
	joinGuild(t, client, memberAccount.Token, invite.Code)

	message := sendChannelMessage(t, client, ownerAccount.Token, channelID, "React to this!")

	unclaimAccount(t, client, memberAccount.UserID)

	emoji := url.PathEscape("👍")
	resp, err := client.putJSONWithAuth(
		fmt.Sprintf("/channels/%s/messages/%s/reactions/%s/@me", guild.SystemChannel, message.ID, emoji),
		nil,
		memberAccount.Token,
	)
	if err != nil {
		t.Fatalf("failed to attempt reaction add: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for unclaimed account adding reaction, got %d: %s", resp.StatusCode, readResponseBody(resp))
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

	t.Log("Unclaimed account cannot add reaction test passed")
}
