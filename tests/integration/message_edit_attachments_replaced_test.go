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

// TestMessageEdit_AttachmentsReplaced tests that when editing a message with a new
// attachments array, the old attachments are replaced
func TestMessageEdit_AttachmentsReplaced(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Message Replace Attachments Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	msg, _ := sendChannelMessageWithAttachment(t, client, user.Token, channelID, "Original message", "yeah.png")

	updatePayload := map[string]any{
		"content":     "Edited without attachments",
		"attachments": []map[string]any{},
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
		Attachments []any  `json:"attachments"`
	}
	decodeJSONResponse(t, resp, &edited)

	if edited.Content != "Edited without attachments" {
		t.Errorf("expected content 'Edited without attachments', got %q", edited.Content)
	}

	if len(edited.Attachments) != 0 {
		t.Errorf("expected 0 attachments after removal, got %d", len(edited.Attachments))
	}
}
