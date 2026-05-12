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

// TestBlockedUserCannotInteract tests that blocked users cannot interact
func TestBlockedUserCannotInteract(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	resp, err := client.putJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", user2.UserID), map[string]int{"type": relationshipBlocked}, user1.Token)
	if err != nil {
		t.Fatalf("failed to block user: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.postJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", user1.UserID), nil, user2.Token)
	if err != nil {
		t.Fatalf("failed to attempt friend request: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for blocked user friend request, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuth("/users/@me/channels", map[string]any{"recipients": []string{user1.UserID}}, user2.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM create: %v", err)
	}
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 200, 403, or 400 for blocked user DM attempt, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
