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

// TestUnclaimedAccountCannotSendFriendRequest verifies that unclaimed accounts
// cannot send friend requests to other users.
func TestUnclaimedAccountCannotSendFriendRequest(t *testing.T) {
	client := newTestClient(t)

	unclaimedAccount := createTestAccount(t, client)
	targetAccount := createTestAccount(t, client)

	unclaimAccount(t, client, unclaimedAccount.UserID)

	resp, err := client.postJSONWithAuth(
		fmt.Sprintf("/users/@me/relationships/%s", targetAccount.UserID),
		map[string]interface{}{},
		unclaimedAccount.Token,
	)
	if err != nil {
		t.Fatalf("failed to attempt friend request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for unclaimed account friend request, got %d: %s", resp.StatusCode, readResponseBody(resp))
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

	t.Log("Unclaimed account cannot send friend request test passed")
}
