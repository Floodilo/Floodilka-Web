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
	"time"
)

// TestUserCannotDeleteOthersMessages tests message delete permissions
func TestUserCannotDeleteOthersMessages(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	member := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Message Delete Guild %d", time.Now().UnixNano()))
	channelID := parseSnowflake(t, guild.SystemChannel)

	invite := createChannelInvite(t, client, owner.Token, channelID)
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/invites/%s", invite.Code), nil, member.Token)
	if err != nil {
		t.Fatalf("failed to accept invite: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	ownerMessage := sendChannelMessage(t, client, owner.Token, channelID, "owner's message to delete")
	ownerMessageID := parseSnowflake(t, ownerMessage.ID)

	resp, err = client.delete(fmt.Sprintf("/channels/%d/messages/%d", channelID, ownerMessageID), member.Token)
	if err != nil {
		t.Fatalf("failed to attempt delete: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 for deleting other's message, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages?limit=10", channelID), owner.Token)
	if err != nil {
		t.Fatalf("failed to verify message exists: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var messages []messageResponse
	decodeJSONResponse(t, resp, &messages)
	found := false
	for _, msg := range messages {
		if msg.ID == ownerMessage.ID {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("message was deleted when it shouldn't have been")
	}
}
