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

func TestRemoveRecipientPermissions(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)

	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)

	groupDmChannel := createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)

	t.Run("non-owner cannot remove others", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/channels/%d/recipients/%s", parseSnowflake(t, groupDmChannel.ID), user2.UserID), user3.Token)
		if err != nil {
			t.Fatalf("failed to send remove request: %v", err)
		}
		if resp.StatusCode == http.StatusNoContent {
			t.Fatalf("expected non-owner to fail removing other members")
		}
		resp.Body.Close()
	})

	t.Run("member can leave group DM", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/channels/%d/recipients/%s", parseSnowflake(t, groupDmChannel.ID), user3.UserID), user3.Token)
		if err != nil {
			t.Fatalf("failed to leave group DM: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})
}
