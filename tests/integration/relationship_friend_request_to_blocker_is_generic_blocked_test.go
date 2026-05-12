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

func TestRelationshipFriendRequestToBlockerIsGenericBlocked(t *testing.T) {
	client := newTestClient(t)
	alice := createTestAccount(t, client)
	bob := createTestAccount(t, client)

	resp, err := client.putJSONWithAuth(
		fmt.Sprintf("/users/@me/relationships/%s", alice.UserID),
		map[string]int{"type": relationshipBlocked},
		bob.Token,
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
	if errResp.Code != "FRIEND_REQUEST_BLOCKED" {
		t.Fatalf("expected FRIEND_REQUEST_BLOCKED, got %s", errResp.Code)
	}

	resp, err = client.getWithAuth("/users/@me/relationships", alice.Token)
	if err != nil {
		t.Fatalf("failed to list alice relationships: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var rels []relationshipResponse
	decodeJSONResponse(t, resp, &rels)
	if len(rels) != 0 {
		t.Fatalf("expected alice to have no relationship entries after blocked friend request attempt, got %d", len(rels))
	}
}
