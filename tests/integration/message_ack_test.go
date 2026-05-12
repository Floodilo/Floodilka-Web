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

func TestMessageAck(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)
	user2Socket := newGatewayClient(t, client, user2.Token)
	t.Cleanup(user2Socket.Close)

	createFriendship(t, client, user1, user2)

	drainRelationshipEvents(t, user1Socket)
	drainRelationshipEvents(t, user2Socket)

	channel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	waitForChannelEvent(t, user1Socket, "CHANNEL_CREATE", channel.ID)

	message := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, channel.ID), "Test message for ack")
	waitForMessageEvent(t, user1Socket, "MESSAGE_CREATE", message.ID, nil)
	waitForMessageEvent(t, user2Socket, "MESSAGE_CREATE", message.ID, nil)

	ackPayload := map[string]any{
		"mention_count": 0,
	}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d/ack", parseSnowflake(t, channel.ID), parseSnowflake(t, message.ID)), ackPayload, user2.Token)
	if err != nil {
		t.Fatalf("failed to ack message: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	waitForAckEvent(t, user2Socket, channel.ID, message.ID)
}
