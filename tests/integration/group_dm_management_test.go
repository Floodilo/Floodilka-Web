/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import "testing"

func TestGroupDMManagement(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)

	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)
	ensureSessionStarted(t, client, user3.Token)
	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)

	t.Run("can create group DM with multiple recipients", func(t *testing.T) {
		groupDM := createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)
		if groupDM.ID == "" {
			t.Error("expected group DM channel ID")
		}
	})
}
