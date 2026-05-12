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

func TestAttachmentDecayPopulatesReferencedMessage(t *testing.T) {
	client := newTestClient(t)
	author := createTestAccount(t, client)
	recipient := createTestAccount(t, client)
	ensureSessionStarted(t, client, author.Token)
	ensureSessionStarted(t, client, recipient.Token)

	createFriendship(t, client, author, recipient)

	channel := createDmChannel(t, client, author.Token, parseSnowflake(t, recipient.UserID))

	originalMessage, originalAttachmentID := sendChannelMessageWithAttachment(
		t,
		client,
		author.Token,
		parseSnowflake(t, channel.ID),
		"Original message for reference",
		"document.pdf",
	)

	replyPayload := map[string]any{
		"content": "Reply referencing expired attachment",
		"message_reference": map[string]any{
			"message_id": originalMessage.ID,
			"channel_id": channel.ID,
			"type":       0,
		},
	}

	resp, err := client.postJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, channel.ID)),
		replyPayload,
		author.Token,
	)
	if err != nil {
		t.Fatalf("failed to post reply: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var reply messageResponse
	decodeJSONResponse(t, resp, &reply)

	rows := []map[string]any{
		{
			"attachment_id":    fmt.Sprintf("%d", originalAttachmentID),
			"channel_id":       channel.ID,
			"message_id":       originalMessage.ID,
			"expires_at":       time.Now().Add(-1 * time.Hour).Format(time.RFC3339Nano),
			"uploaded_at":      time.Now().Add(-2 * time.Hour).Format(time.RFC3339Nano),
			"last_accessed_at": time.Now().Add(-1 * time.Hour).Format(time.RFC3339Nano),
			"filename":         "expired-reference.bin",
			"size_bytes":       2048,
			"cost":             2,
			"lifetime_days":    1,
		},
	}

	resp, err = client.postJSONWithAuth("/test/attachment-decay/rows", map[string]any{"rows": rows}, author.Token)
	if err != nil {
		t.Fatalf("failed to seed attachment decay rows: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	resp, err = client.getWithAuth(
		fmt.Sprintf("/test/messages/%d/%d/with-reference", parseSnowflake(t, channel.ID), parseSnowflake(t, reply.ID)),
		author.Token,
	)
	if err != nil {
		t.Fatalf("failed to fetch message with reference: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var fetched struct {
		ID                string `json:"id"`
		ReferencedMessage struct {
			Attachments []struct {
				ID        string  `json:"id"`
				URL       *string `json:"url"`
				Expired   *bool   `json:"expired"`
				ExpiresAt *string `json:"expires_at"`
			} `json:"attachments"`
		} `json:"referenced_message"`
	}
	decodeJSONResponse(t, resp, &fetched)

	if len(fetched.ReferencedMessage.Attachments) == 0 {
		t.Fatalf("expected referenced message to include attachments")
	}

	for _, attachment := range fetched.ReferencedMessage.Attachments {
		if attachment.URL != nil {
			t.Fatalf("expected referenced message attachment to hide url")
		}
		if attachment.Expired == nil || !*attachment.Expired {
			t.Fatalf("expected referenced message attachment to be marked expired")
		}
		if attachment.ExpiresAt == nil {
			t.Fatalf("expected referenced message attachment to include expires_at")
		}
	}
}
