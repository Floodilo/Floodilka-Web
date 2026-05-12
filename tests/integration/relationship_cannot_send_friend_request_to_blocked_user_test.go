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
)

func TestRelationshipCannotSendFriendRequestToBlockedUser(t *testing.T) {
	client := newTestClient(t)
	alice := createTestAccount(t, client)
	bob := createTestAccount(t, client)

	resp, err := client.putJSONWithAuth(
		fmt.Sprintf("/users/@me/relationships/%s", bob.UserID),
		map[string]int{"type": relationshipBlocked},
		alice.Token,
	)
	if err != nil {
		t.Fatalf("failed to block user: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.postJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", bob.UserID), nil, alice.Token)
	if err != nil {
		t.Fatalf("failed to attempt friend request: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", resp.StatusCode)
	}
	var errResp struct {
		Code string `json:"code"`
	}
	decodeJSONResponse(t, resp, &errResp)
	if errResp.Code != "CANNOT_SEND_FRIEND_REQUEST_TO_BLOCKED_USER" {
		t.Fatalf("expected CANNOT_SEND_FRIEND_REQUEST_TO_BLOCKED_USER, got %s", errResp.Code)
	}
}
