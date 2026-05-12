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

func TestMessageFetchEmptyChannel(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	guild := createGuild(t, client, account.Token, "Empty Channel Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	clearChannelMessages(t, client, channelID, account.Token)

	state := getChannelState(t, client, channelID, account.Token)
	if state.HasMessages {
		t.Fatalf("expected channel state to show has_messages = false, got true")
	}
	if state.LastMessageID != nil {
		t.Fatalf("expected channel state to have no last_message_id, got %s", *state.LastMessageID)
	}

	resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages?limit=50", channelID), account.Token)
	if err != nil {
		t.Fatalf("failed to fetch messages: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var fetchedMessages []struct {
		ID        string `json:"id"`
		ChannelID string `json:"channel_id"`
		Content   string `json:"content"`
	}
	decodeJSONResponse(t, resp, &fetchedMessages)

	if len(fetchedMessages) != 0 {
		t.Fatalf("expected empty array for channel with no messages, got %d messages", len(fetchedMessages))
	}

	buckets := getChannelBuckets(t, client, channelID, account.Token)
	if buckets.Count != 0 {
		t.Fatalf("expected no buckets for empty channel, got %d buckets", buckets.Count)
	}
}
