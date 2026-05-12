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

// TestDMCreationRequiresFriendshipOrMutualGuild verifies that users cannot create
// DMs with strangers who they don't share a guild with and aren't friends with.
func TestDMCreationRequiresFriendshipOrMutualGuild(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth("/users/@me/channels", map[string]string{"recipient_id": user2.UserID}, user1.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM creation: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 403 or 400 for DM with stranger, got %d", resp.StatusCode)
	}
}
