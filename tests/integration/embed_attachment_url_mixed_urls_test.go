/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"strings"
	"testing"
)

// TestEmbedAttachmentURL_MixedURLs tests embed with external URL for thumbnail, attachment:// for image
func TestEmbedAttachmentURL_MixedURLs(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Mixed URLs Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	fileData, err := fixturesFS.ReadFile("fixtures/yeah.png")
	if err != nil {
		t.Fatalf("failed to read fixture yeah.png: %v", err)
	}

	// Create multipart form with mixed URL types
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	payload := map[string]any{
		"content": "Mixed URL types",
		"attachments": []map[string]any{
			{"id": 0, "filename": "yeah.png"},
		},
		"embeds": []map[string]any{
			{
				"title":       "Mixed URLs",
				"description": "External thumbnail, attached image",
				"thumbnail": map[string]string{
					"url": "https://example.com/thumbnail.png",
				},
				"image": map[string]string{
					"url": "attachment://yeah.png",
				},
			},
		},
	}

	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("failed to encode payload JSON: %v", err)
	}

	if err := writer.WriteField("payload_json", string(payloadJSON)); err != nil {
		t.Fatalf("failed to write payload_json field: %v", err)
	}

	fileWriter, err := writer.CreateFormFile("files[0]", "yeah.png")
	if err != nil {
		t.Fatalf("failed to create files[0] field: %v", err)
	}
	if _, err := fileWriter.Write(fileData); err != nil {
		t.Fatalf("failed to write file data: %v", err)
	}

	if err := writer.Close(); err != nil {
		t.Fatalf("failed to close multipart writer: %v", err)
	}

	req, err := http.NewRequest(
		http.MethodPost,
		fmt.Sprintf("%s/channels/%d/messages", client.baseURL, channelID),
		&body,
	)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	client.applyCommonHeaders(req)
	req.Header.Set("Authorization", user.Token)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("failed to send request: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var msgResp struct {
		Embeds []struct {
			Image struct {
				URL string `json:"url"`
			} `json:"image"`
			Thumbnail struct {
				URL string `json:"url"`
			} `json:"thumbnail"`
		} `json:"embeds"`
	}
	decodeJSONResponse(t, resp, &msgResp)

	if len(msgResp.Embeds) != 1 {
		t.Fatalf("expected 1 embed, got %d", len(msgResp.Embeds))
	}

	embed := msgResp.Embeds[0]

	if embed.Thumbnail.URL != "https://example.com/thumbnail.png" {
		t.Errorf("expected thumbnail URL 'https://example.com/thumbnail.png', got '%s'", embed.Thumbnail.URL)
	}

	if embed.Image.URL == "" {
		t.Error("expected image URL to be populated")
	}
	if strings.Contains(embed.Image.URL, "attachment://") {
		t.Errorf("expected image attachment:// URL to be resolved, got '%s'", embed.Image.URL)
	}
	if !strings.Contains(embed.Image.URL, "yeah.png") {
		t.Errorf("expected image URL to contain 'yeah.png', got '%s'", embed.Image.URL)
	}
}
