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

func TestMessageDeleteReconcilesState(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	guild := createGuild(t, client, account.Token, "Delete Reconcile Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	clearChannelMessages(t, client, channelID, account.Token)

	// Seed 10 messages with bucket index populated
	const totalMessages = 10
	seedResult := seedMessagesWithContent(t, client, channelID, totalMessages, account.UserID)

	if len(seedResult.Messages) != totalMessages {
		t.Fatalf("expected %d messages to be seeded, got %d", totalMessages, len(seedResult.Messages))
	}

	stateBefore := getChannelState(t, client, channelID, account.Token)
	if !stateBefore.HasMessages {
		t.Fatalf("expected channel state to show has_messages = true")
	}
	if stateBefore.LastMessageID == nil {
		t.Fatalf("expected channel state to have last_message_id")
	}

	lastMessageIDBefore := *stateBefore.LastMessageID
	lastMessageID := parseSnowflake(t, lastMessageIDBefore)

	expectedLastMessageID := seedResult.Messages[totalMessages-1].MessageID
	if lastMessageIDBefore != expectedLastMessageID {
		t.Fatalf("expected last_message_id to be %s, got %s", expectedLastMessageID, lastMessageIDBefore)
	}

	resp, err := client.delete(fmt.Sprintf("/channels/%d/messages/%d", channelID, lastMessageID), account.Token)
	if err != nil {
		t.Fatalf("failed to delete last message: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	stateAfterDelete := getChannelState(t, client, channelID, account.Token)
	if !stateAfterDelete.HasMessages {
		t.Fatalf("expected channel state to show has_messages = true after deleting one message")
	}
	if stateAfterDelete.LastMessageID == nil {
		t.Fatalf("expected channel state to have last_message_id after deleting one message")
	}

	expectedNewLastMessageID := seedResult.Messages[totalMessages-2].MessageID
	if *stateAfterDelete.LastMessageID != expectedNewLastMessageID {
		t.Fatalf("expected last_message_id to be updated to %s, got %s", expectedNewLastMessageID, *stateAfterDelete.LastMessageID)
	}

	for i := totalMessages - 2; i >= 0; i-- {
		msgID := parseSnowflake(t, seedResult.Messages[i].MessageID)
		resp, err := client.delete(fmt.Sprintf("/channels/%d/messages/%d", channelID, msgID), account.Token)
		if err != nil {
			t.Fatalf("failed to delete message %d: %v", i, err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	}

	stateAfterDeleteAll := getChannelState(t, client, channelID, account.Token)
	if stateAfterDeleteAll.HasMessages {
		t.Fatalf("expected channel state to show has_messages = false after deleting all messages, got true")
	}

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages?limit=50", channelID), account.Token)
	if err != nil {
		t.Fatalf("failed to fetch messages after deletion: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var fetchedMessages []struct {
		ID        string `json:"id"`
		ChannelID string `json:"channel_id"`
		Content   string `json:"content"`
	}
	decodeJSONResponse(t, resp, &fetchedMessages)

	if len(fetchedMessages) != 0 {
		t.Fatalf("expected empty array after deleting all messages, got %d messages", len(fetchedMessages))
	}
}
