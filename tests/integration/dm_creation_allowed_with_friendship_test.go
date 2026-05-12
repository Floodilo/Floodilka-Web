/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

// TestDMCreationAllowedWithFriendship verifies that friends can create DMs with each other.
func TestDMCreationAllowedWithFriendship(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	createFriendship(t, client, user1, user2)

	resp, err := client.postJSONWithAuth("/users/@me/channels", map[string]string{"recipient_id": user2.UserID}, user1.Token)
	if err != nil {
		t.Fatalf("failed to create DM: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)
	if channel.ID == "" {
		t.Fatalf("expected channel ID in response")
	}
}
