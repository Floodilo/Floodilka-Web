/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"testing"
	"time"
)

// TestMessageAttachmentDelete_LastAttachmentEmptyMessageWithReactions verifies that
// deleting the last attachment from an empty message with reactions deletes the message
// and cleans up the reactions
func TestMessageAttachmentDelete_LastAttachmentEmptyMessageWithReactions(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	gateway := newGatewayClient(t, client, user.Token)
	t.Cleanup(gateway.Close)

	guild := createGuild(t, client, user.Token, "Attachment Reactions Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	msg, attachmentID := sendChannelMessageWithAttachment(t, client, user.Token, channelID, "", "yeah.png")
	messageID := parseSnowflake(t, msg.ID)

	emoji := "👍"
	resp, err := client.putWithAuth(
		fmt.Sprintf("/channels/%d/messages/%d/reactions/%s/@me", channelID, messageID, url.PathEscape(emoji)),
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to add reaction: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	gateway.WaitForEvent(t, "MESSAGE_REACTION_ADD", 10*time.Second, func(data json.RawMessage) bool {
		var reaction struct {
			MessageID string `json:"message_id"`
		}
		json.Unmarshal(data, &reaction)
		return reaction.MessageID == msg.ID
	})

	resp, err = client.deleteJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages/%d/attachments/%d", channelID, messageID, attachmentID),
		nil,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to delete attachment: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	gateway.WaitForEvent(t, "MESSAGE_DELETE", 10*time.Second, func(data json.RawMessage) bool {
		var del struct {
			ID string `json:"id"`
		}
		json.Unmarshal(data, &del)
		return del.ID == msg.ID
	})

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), user.Token)
	if err != nil {
		t.Fatalf("failed to check message: %v", err)
	}
	assertStatus(t, resp, http.StatusNotFound)
	resp.Body.Close()
}
