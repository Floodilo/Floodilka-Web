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

// TestEmbedAttachmentURL_NoAttachmentsError tests embed uses attachment:// but no files uploaded, expect 400 error
func TestEmbedAttachmentURL_NoAttachmentsError(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "No Attachments Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	payload := map[string]any{
		"content": "Embed references attachment but none provided",
		"embeds": []map[string]any{
			{
				"title":       "Invalid Reference",
				"description": "No attachment uploaded",
				"image": map[string]string{
					"url": "attachment://image.png",
				},
			},
		},
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), payload, user.Token)
	if err != nil {
		t.Fatalf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusBadRequest)
}
