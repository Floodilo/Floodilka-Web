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

func TestGroupDMNameUpdate(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)

	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)
	drainRelationshipEvents(t, user1Socket)

	groupDmChannel := createGroupDmChannel(t, client, user1.Token, user2.UserID, user3.UserID)
	waitForChannelEvent(t, user1Socket, "CHANNEL_CREATE", groupDmChannel.ID)

	updatePayload := map[string]any{
		"name": "Cool Group Chat",
	}
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d", parseSnowflake(t, groupDmChannel.ID)), updatePayload, user1.Token)
	if err != nil {
		t.Fatalf("failed to update group DM name: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var updatedChannel struct {
		ID   string  `json:"id"`
		Name *string `json:"name"`
	}
	decodeJSONResponse(t, resp, &updatedChannel)
	if updatedChannel.Name == nil || *updatedChannel.Name != "Cool Group Chat" {
		t.Fatalf("expected group DM name to be 'Cool Group Chat'")
	}
}
