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

func TestBulkDeleteMessagesValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	guild := createGuild(t, client, owner.Token, "Validation Test Guild")

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", parseSnowflake(t, guild.ID)), map[string]any{
		"name": "test-channel",
		"type": 0,
	}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create channel: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)

	t.Run("reject empty message_ids array", func(t *testing.T) {
		bulkDeletePayload := map[string]any{
			"message_ids": []string{},
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages/bulk-delete", parseSnowflake(t, channel.ID)), bulkDeletePayload, owner.Token)
		if err != nil {
			t.Fatalf("failed to send request: %v", err)
		}
		if resp.StatusCode == http.StatusNoContent {
			t.Fatalf("expected bulk delete with empty array to fail")
		}
		resp.Body.Close()
	})

	t.Run("reject too many messages", func(t *testing.T) {
		var tooManyIDs []string
		for i := 0; i < 101; i++ {
			tooManyIDs = append(tooManyIDs, fmt.Sprintf("%d", 1000000+i))
		}
		bulkDeletePayload := map[string]any{
			"message_ids": tooManyIDs,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages/bulk-delete", parseSnowflake(t, channel.ID)), bulkDeletePayload, owner.Token)
		if err != nil {
			t.Fatalf("failed to send request: %v", err)
		}
		if resp.StatusCode == http.StatusNoContent {
			t.Fatalf("expected bulk delete with >100 messages to fail")
		}
		resp.Body.Close()
	})
}
