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

func TestGuildChannelTopicUpdate(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	ownerSocket := newGatewayClient(t, client, owner.Token)
	t.Cleanup(ownerSocket.Close)

	guild := createGuild(t, client, owner.Token, "Topic Test Guild")
	waitForGuildEvent(t, ownerSocket, "GUILD_CREATE", guild.ID)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", parseSnowflake(t, guild.ID)), map[string]any{
		"name": "general",
		"type": 0,
	}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create channel: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)
	waitForChannelEvent(t, ownerSocket, "CHANNEL_CREATE", channel.ID)

	updatePayload := map[string]any{
		"topic": "This is the new channel topic",
		"type":  0,
	}
	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d", parseSnowflake(t, channel.ID)), updatePayload, owner.Token)
	if err != nil {
		t.Fatalf("failed to update channel topic: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var updatedChannel struct {
		ID    string  `json:"id"`
		Topic *string `json:"topic"`
	}
	decodeJSONResponse(t, resp, &updatedChannel)
	if updatedChannel.Topic == nil || *updatedChannel.Topic != "This is the new channel topic" {
		t.Fatalf("expected channel topic to be set")
	}

	waitForChannelEvent(t, ownerSocket, "CHANNEL_UPDATE", channel.ID)
}
