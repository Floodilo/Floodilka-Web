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

// TestMessageAttachmentDelete_PermissionDenied verifies that only the message author
// can delete attachments from their messages
func TestMessageAttachmentDelete_PermissionDenied(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)

	guild := createGuild(t, client, user1.Token, "Permission Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	invite := createChannelInvite(t, client, user1.Token, channelID)
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/invites/%s", invite.Code), nil, user2.Token)
	if err != nil {
		t.Fatalf("failed to join guild: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	msg, attachmentID := sendChannelMessageWithAttachment(t, client, user1.Token, channelID, "User 1's message", "yeah.png")
	messageID := parseSnowflake(t, msg.ID)

	resp, err = client.deleteJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages/%d/attachments/%d", channelID, messageID, attachmentID),
		nil,
		user2.Token,
	)
	if err != nil {
		t.Fatalf("failed to attempt delete: %v", err)
	}
	assertStatus(t, resp, http.StatusForbidden)
	resp.Body.Close()

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), user1.Token)
	if err != nil {
		t.Fatalf("failed to get message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var checkMsg struct {
		Attachments []any `json:"attachments"`
	}
	decodeJSONResponse(t, resp, &checkMsg)
	if len(checkMsg.Attachments) != 1 {
		t.Errorf("expected 1 attachment to remain, got %d", len(checkMsg.Attachments))
	}
}
