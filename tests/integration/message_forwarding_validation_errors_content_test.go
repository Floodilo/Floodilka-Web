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

func TestMessageForwardingValidationErrors(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)

	createFriendship(t, client, user1, user2)
	channel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	originalMessage := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, channel.ID), "Original message")

	t.Run("reject forward with content", func(t *testing.T) {
		payload := map[string]any{
			"content": "Cannot have content when forwarding",
			"message_reference": map[string]any{
				"message_id": originalMessage.ID,
				"channel_id": channel.ID,
				"type":       1,
			},
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, channel.ID)), payload, user1.Token)
		if err != nil {
			t.Fatalf("failed to send request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject forward with embeds", func(t *testing.T) {
		payload := map[string]any{
			"embeds": []map[string]string{
				{"title": "Test embed"},
			},
			"message_reference": map[string]any{
				"message_id": originalMessage.ID,
				"channel_id": channel.ID,
				"type":       1,
			},
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, channel.ID)), payload, user1.Token)
		if err != nil {
			t.Fatalf("failed to send request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject forward with attachments", func(t *testing.T) {
		payload := map[string]any{
			"attachments": []map[string]any{
				{
					"id":       0,
					"filename": "test.png",
				},
			},
			"message_reference": map[string]any{
				"message_id": originalMessage.ID,
				"channel_id": channel.ID,
				"type":       1,
			},
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, channel.ID)), payload, user1.Token)
		if err != nil {
			t.Fatalf("failed to send request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject forward without required fields", func(t *testing.T) {
		payload := map[string]any{
			"message_reference": map[string]any{
				"message_id": originalMessage.ID,
				"type":       1,
			},
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, channel.ID)), payload, user1.Token)
		if err != nil {
			t.Fatalf("failed to send request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})
}
