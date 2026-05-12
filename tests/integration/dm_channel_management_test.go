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

func TestDMChannelManagement(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)
	createFriendship(t, client, user1, user2)

	t.Run("can create DM channel", func(t *testing.T) {
		dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
		if dm.ID == "" {
			t.Error("expected DM channel ID")
		}
	})

	dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	dmID := parseSnowflake(t, dm.ID)

	t.Run("can get DM channel", func(t *testing.T) {
		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d", dmID), user1.Token)
		if err != nil {
			t.Fatalf("failed to get DM: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		resp.Body.Close()
	})

	t.Run("can close DM channel", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/channels/%d", dmID), user1.Token)
		if err != nil {
			t.Fatalf("failed to close DM: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})
}
