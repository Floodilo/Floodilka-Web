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

func TestMessagePins(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	guild := createGuild(t, client, owner.Token, "Pin Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	payload := map[string]string{"content": "Pin me"}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to send message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var message struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &message)
	messageID := parseSnowflake(t, message.ID)

	t.Run("can pin message", func(t *testing.T) {
		resp, err := client.putWithAuth(fmt.Sprintf("/channels/%d/pins/%d", channelID, messageID), owner.Token)
		if err != nil {
			t.Fatalf("failed to pin message: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})

	t.Run("can get pinned messages", func(t *testing.T) {
		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/pins", channelID), owner.Token)
		if err != nil {
			t.Fatalf("failed to get pins: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var pinsResponse struct {
			Items []struct {
				Message struct {
					ID string `json:"id"`
				} `json:"message"`
			} `json:"items"`
			HasMore bool `json:"has_more"`
		}
		decodeJSONResponse(t, resp, &pinsResponse)
		if len(pinsResponse.Items) != 1 {
			t.Errorf("expected 1 pinned message, got %d", len(pinsResponse.Items))
		}
	})

	t.Run("can unpin message", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/channels/%d/pins/%d", channelID, messageID), owner.Token)
		if err != nil {
			t.Fatalf("failed to unpin message: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})
}
