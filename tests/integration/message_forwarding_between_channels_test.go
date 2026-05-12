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

func TestMessageForwardingBetweenChannels(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)
	ensureSessionStarted(t, client, user3.Token)

	user1Socket := newGatewayClient(t, client, user1.Token)
	t.Cleanup(user1Socket.Close)
	user2Socket := newGatewayClient(t, client, user2.Token)
	t.Cleanup(user2Socket.Close)

	createFriendship(t, client, user1, user2)
	createFriendship(t, client, user1, user3)

	drainRelationshipEvents(t, user1Socket)
	drainRelationshipEvents(t, user2Socket)

	channel1 := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	channel2 := createDmChannel(t, client, user1.Token, parseSnowflake(t, user3.UserID))

	waitForChannelEvent(t, user1Socket, "CHANNEL_CREATE", channel1.ID)
	waitForChannelEvent(t, user1Socket, "CHANNEL_CREATE", channel2.ID)

	originalMessage := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, channel1.ID), "Original message to forward")
	waitForMessageEvent(t, user1Socket, "MESSAGE_CREATE", originalMessage.ID, nil)
	waitForMessageEvent(t, user2Socket, "MESSAGE_CREATE", originalMessage.ID, nil)

	forwardPayload := map[string]any{
		"message_reference": map[string]any{
			"message_id": originalMessage.ID,
			"channel_id": channel1.ID,
			"type":       1,
		},
	}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, channel2.ID)), forwardPayload, user1.Token)
	if err != nil {
		t.Fatalf("failed to forward message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var forwardedMessage messageResponse
	decodeJSONResponse(t, resp, &forwardedMessage)
	if forwardedMessage.ID == "" {
		t.Fatalf("forwarded message response missing id")
	}

	waitForMessageEvent(t, user1Socket, "MESSAGE_CREATE", forwardedMessage.ID, nil)

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d", parseSnowflake(t, channel2.ID), parseSnowflake(t, forwardedMessage.ID)), user1.Token)
	if err != nil {
		t.Fatalf("failed to get forwarded message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var fetchedMessage struct {
		ID               string `json:"id"`
		Content          string `json:"content"`
		MessageSnapshots []any  `json:"message_snapshots,omitempty"`
		MessageReference any    `json:"message_reference,omitempty"`
	}
	decodeJSONResponse(t, resp, &fetchedMessage)
	if len(fetchedMessage.MessageSnapshots) == 0 {
		t.Fatalf("expected forwarded message to have message_snapshots")
	}
}
