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

func TestClearChannelAck(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)

	createFriendship(t, client, user1, user2)
	channel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	message := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, channel.ID), "Test message")

	ackPayload := map[string]any{
		"mention_count": 0,
	}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d/ack", parseSnowflake(t, channel.ID), parseSnowflake(t, message.ID)), ackPayload, user2.Token)
	if err != nil {
		t.Fatalf("failed to ack message: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/channels/%d/messages/ack", parseSnowflake(t, channel.ID)), user2.Token)
	if err != nil {
		t.Fatalf("failed to clear ack: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()
}
