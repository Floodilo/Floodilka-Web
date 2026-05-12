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

func TestGatewayFriendPresenceWithoutGuild(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	createFriendship(t, client, user1, user2)

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)
	user2Socket := newGatewayClient(t, client, user2.Token)
	t.Cleanup(user2Socket.Close)

	ready1 := user1Socket.WaitForEvent(t, "READY", 15*time.Second, nil)
	ready2 := user2Socket.WaitForEvent(t, "READY", 15*time.Second, nil)

	assertUserInReady(t, ready1.Data, user2.UserID)
	assertUserInReady(t, ready2.Data, user1.UserID)

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

	user1Socket.WaitForEvent(t, "PRESENCE_UPDATE", 30*time.Second, matchPresence(user2.UserID))
}
