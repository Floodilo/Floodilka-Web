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

// TestMessageEdit_KeepExistingAttachmentInArray tests that when editing a message
// and explicitly including the existing attachment in the attachments array,
// it is preserved correctly
func TestMessageEdit_KeepExistingAttachmentInArray(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Keep Attachment Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	msg, attachmentID := sendChannelMessageWithAttachment(t, client, user.Token, channelID, "Original message", "yeah.png")

	updatePayload := map[string]any{
		"content": "Edited, keeping attachment",
		"attachments": []map[string]any{
			{
				"id":       0,
				"filename": "yeah.png",
			},
		},
	}

	resp, err := client.patchJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages/%s", channelID, msg.ID),
		updatePayload,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to edit message: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var edited struct {
		Content     string `json:"content"`
		Attachments []struct {
			ID       string `json:"id"`
			Filename string `json:"filename"`
		} `json:"attachments"`
	}
	decodeJSONResponse(t, resp, &edited)

	if edited.Content != "Edited, keeping attachment" {
		t.Errorf("expected content 'Edited, keeping attachment', got %q", edited.Content)
	}

	if len(edited.Attachments) != 1 {
		t.Fatalf("expected 1 attachment, got %d", len(edited.Attachments))
	}

	editedAttachmentID := parseSnowflake(t, edited.Attachments[0].ID)
	if editedAttachmentID != attachmentID {
		t.Errorf("expected attachment ID %d, got %d", attachmentID, editedAttachmentID)
	}

	if edited.Attachments[0].Filename != "yeah.png" {
		t.Errorf("expected filename 'yeah.png', got %q", edited.Attachments[0].Filename)
	}
}
