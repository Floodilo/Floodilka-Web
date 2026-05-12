/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
	"time"
)

// TestNoSelfPresenceUpdates verifies that a user never receives PRESENCE_UPDATE
// events for their own presence.
func TestNoSelfPresenceUpdates(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)

	createFriendship(t, client, user1, user2)

	guild := createGuild(t, client, user1.Token, fmt.Sprintf("NoSelf Guild %d", time.Now().UnixNano()))
	channelID := parseSnowflake(t, guild.SystemChannel)

	invite := createChannelInvite(t, client, user1.Token, channelID)
	joinGuild(t, client, user2.Token, invite.Code)

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)

	ready1 := user1Socket.WaitForEvent(t, "READY", 15*time.Second, nil)
	user1ID := extractUserIDFromReady(t, ready1.Data)

	drainPresenceEvents(t, user1Socket, 500*time.Millisecond)

	user2Socket := newGatewayClient(t, client, user2.Token)
	t.Cleanup(user2Socket.Close)

	user2Socket.WaitForEvent(t, "READY", 15*time.Second, nil)

	presences := collectPresenceUpdates(t, user1Socket, 2*time.Second)

	for _, p := range presences {
		pUserID := extractUserIDFromPresence(t, p)
		if pUserID == user1ID {
			t.Fatalf("user1 received their own PRESENCE_UPDATE with guild_id: %v", hasGuildID(p))
		}
	}
}
