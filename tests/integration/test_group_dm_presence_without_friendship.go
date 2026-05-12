/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"testing"
	"time"
)

func TestGatewayGroupDMPresenceWithoutFriendship(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)

	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)
	ensureSessionStarted(t, client, user3.Token)

	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)

	createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)

	user2Socket := newGatewayClient(t, client, user2.Token)
	t.Cleanup(user2Socket.Close)
	user3Socket := newGatewayClient(t, client, user3.Token)
	t.Cleanup(user3Socket.Close)

	ready2 := user2Socket.WaitForEvent(t, "READY", 15*time.Second, nil)
	ready3 := user3Socket.WaitForEvent(t, "READY", 15*time.Second, nil)

	assertUserInReady(t, ready2.Data, user3.UserID)
	assertUserInReady(t, ready3.Data, user2.UserID)

	matchPresence := func(expectedUserID string) func(json.RawMessage) bool {
		return func(raw json.RawMessage) bool {
			var payload map[string]any
			if err := json.Unmarshal(raw, &payload); err != nil {
				t.Fatalf("failed to decode presence update: %v", err)
			}
			user, ok := payload["user"].(map[string]any)
			if !ok {
				return false
			}
			id, ok := user["id"].(string)
			if !ok || id != expectedUserID {
				return false
			}
			_, hasGuild := payload["guild_id"]
			return !hasGuild
		}
	}

	user2Socket.WaitForEvent(t, "PRESENCE_UPDATE", 30*time.Second, matchPresence(user3.UserID))
	user3Socket.WaitForEvent(t, "PRESENCE_UPDATE", 30*time.Second, matchPresence(user2.UserID))
}
