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

func TestAddRecipientPermissions(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)
	user4 := createTestAccount(t, client)

	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)

	groupDmChannel := createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)

	t.Run("cannot add non-friend", func(t *testing.T) {
		resp, err := client.putJSONWithAuth(fmt.Sprintf("/channels/%d/recipients/%s", parseSnowflake(t, groupDmChannel.ID), user4.UserID), nil, user1.Token)
		if err != nil {
			t.Fatalf("failed to send add recipient request: %v", err)
		}
		if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusNoContent {
			t.Fatalf("expected adding non-friend to fail")
		}
		resp.Body.Close()
	})
}
