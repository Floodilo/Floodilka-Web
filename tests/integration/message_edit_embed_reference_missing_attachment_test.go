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

// TestMessageEdit_EmbedReferenceMissingAttachment tests that editing a message
// with an embed that references a non-existent attachment fails
func TestMessageEdit_EmbedReferenceMissingAttachment(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Missing Attachment Edit Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	msg, _ := sendChannelMessageWithAttachment(t, client, user.Token, channelID, "Original message", "yeah.png")

	updatePayload := map[string]any{
		"content": "Edited",
		"embeds": []map[string]any{
			{
				"title": "Non-existent",
				"image": map[string]string{
					"url": "attachment://missing.png",
				},
			},
		},
	}

	resp, err := client.patchJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages/%s", channelID, msg.ID),
		updatePayload,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusBadRequest)
}
