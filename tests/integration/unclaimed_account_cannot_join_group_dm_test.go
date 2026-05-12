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

// TestUnclaimedAccountCannotJoinGroupDM verifies that unclaimed accounts
// cannot join group DMs via invite.
func TestUnclaimedAccountCannotJoinGroupDM(t *testing.T) {
	client := newTestClient(t)

	ownerAccount := createTestAccount(t, client)
	friend1Account := createTestAccount(t, client)
	friend2Account := createTestAccount(t, client)

	createFriendship(t, client, ownerAccount, friend1Account)
	createFriendship(t, client, ownerAccount, friend2Account)

	resp, err := client.postJSONWithAuth("/users/@me/channels", map[string]interface{}{
		"recipients": []string{friend1Account.UserID},
	}, ownerAccount.Token)
	if err != nil {
		t.Fatalf("failed to create group DM: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("failed to create group DM, got status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var channel struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&channel); err != nil {
		t.Fatalf("failed to decode channel response: %v", err)
	}

	resp, err = client.postJSONWithAuth(
		fmt.Sprintf("/channels/%s/invites", channel.ID),
		map[string]interface{}{},
		ownerAccount.Token,
	)
	if err != nil {
		t.Fatalf("failed to create group DM invite: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("failed to create group DM invite, got status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var inviteResp struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&inviteResp); err != nil {
		t.Fatalf("failed to decode invite response: %v", err)
	}

	unclaimAccount(t, client, friend2Account.UserID)

	resp, err = client.postJSONWithAuth("/invites/"+inviteResp.Code, nil, friend2Account.Token)
	if err != nil {
		t.Fatalf("failed to attempt group DM join: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for unclaimed account joining group DM, got %d: %s", resp.StatusCode, readResponseBody(resp))
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

	t.Log("Unclaimed account cannot join group DM test passed")
}
