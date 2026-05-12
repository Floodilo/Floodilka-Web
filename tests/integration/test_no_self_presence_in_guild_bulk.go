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

// TestNoSelfPresenceInGuildBulk verifies that when receiving bulk presence updates
// for a guild, the user's own presence is filtered out.
func TestNoSelfPresenceInGuildBulk(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)

	ensureSessionStarted(t, client, user1.Token)

	guild := createGuild(t, client, user1.Token, fmt.Sprintf("BulkTest Guild %d", time.Now().UnixNano()))

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)

	ready1 := user1Socket.WaitForEvent(t, "READY", 15*time.Second, nil)
	user1ID := extractUserIDFromReady(t, ready1.Data)

	presences := extractPresencesFromReady(t, ready1.Data)
	for _, p := range presences {
		pUserID := extractUserIDFromPresenceMap(t, p)
		if pUserID == user1ID {
			t.Fatalf("READY included user's own presence in presences array")
		}
	}

	drainPresenceEvents(t, user1Socket, 500*time.Millisecond)

	presenceUpdates := collectPresenceUpdates(t, user1Socket, 1*time.Second)
	for _, p := range presenceUpdates {
		pUserID := extractUserIDFromPresence(t, p)
		if pUserID == user1ID {
			guildIDVal := extractGuildIDFromPresence(p)
			t.Fatalf("user received their own PRESENCE_UPDATE for guild %s", guildIDVal)
		}
	}

	_ = guild
}
