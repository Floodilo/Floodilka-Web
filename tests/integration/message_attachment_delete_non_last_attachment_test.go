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
	"testing"
	"time"
)

// TestMessageAttachmentDelete_NonLastAttachment verifies that deleting an attachment
// from a message with multiple attachments only removes that attachment
func TestMessageAttachmentDelete_NonLastAttachment(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	gateway := newGatewayClient(t, client, user.Token)
	t.Cleanup(gateway.Close)

	guild := createGuild(t, client, user.Token, "Multiple Attachments Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	msg, firstAttachmentID := sendChannelMessageWithAttachment(t, client, user.Token, channelID, "", "yeah.png")
	messageID := parseSnowflake(t, msg.ID)

	msg2, att2 := sendChannelMessageWithAttachment(t, client, user.Token, channelID, "Message with attachment", "yeah.png")
	msg2ID := parseSnowflake(t, msg2.ID)

	resp, err := client.deleteJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages/%d/attachments/%d", channelID, msg2ID, att2),
		nil,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to delete attachment: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	gateway.WaitForEvent(t, "MESSAGE_UPDATE", 10*time.Second, func(data json.RawMessage) bool {
		var update struct {
			ID string `json:"id"`
		}
		json.Unmarshal(data, &update)
		return update.ID == msg2.ID
	})

	resp, err = client.deleteJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages/%d/attachments/%d", channelID, messageID, firstAttachmentID),
		nil,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to delete first message attachment: %v", err)
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
}
