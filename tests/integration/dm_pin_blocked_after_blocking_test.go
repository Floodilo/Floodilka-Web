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

// TestDMPinBlockedAfterBlocking verifies that messages cannot be pinned in a DM
// after one user blocks the other.
func TestDMPinBlockedAfterBlocking(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	createFriendship(t, client, user1, user2)

	channel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	msg := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, channel.ID), "message to pin")

	resp, err := client.putJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", user2.UserID), map[string]int{"type": relationshipBlocked}, user1.Token)
	if err != nil {
		t.Fatalf("failed to block user: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/channels/%s/pins/%s", channel.ID, msg.ID), nil, user2.Token)
	if err != nil {
		t.Fatalf("failed to attempt pinning message: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 403 or 400 for pin to blocker, got %d", resp.StatusCode)
	}
}
