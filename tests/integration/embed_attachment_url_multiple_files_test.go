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

// TestEmbedAttachmentURL_MultipleFiles tests embed references specific file by filename when multiple attachments exist
func TestEmbedAttachmentURL_MultipleFiles(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Multiple Files Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	file1Data, err := fixturesFS.ReadFile("fixtures/yeah.png")
	if err != nil {
		t.Fatalf("failed to read fixture yeah.png: %v", err)
	}

	file2Data, err := fixturesFS.ReadFile("fixtures/thisisfine.gif")
	if err != nil {
		t.Fatalf("failed to read fixture thisisfine.gif: %v", err)
	}

	// Create multipart form - upload both files but embed only references one
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	payload := map[string]any{
		"content": "Multiple files uploaded, embed uses specific one",
		"attachments": []map[string]any{
			{"id": 0, "filename": "yeah.png"},
			{"id": 1, "filename": "thisisfine.gif"},
		},
		"embeds": []map[string]any{
			{
				"title":       "Selective Reference",
				"description": "This embed references the GIF specifically",
				"image": map[string]string{
					"url": "attachment://thisisfine.gif",
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

	file1Writer, err := writer.CreateFormFile("files[0]", "yeah.png")
	if err != nil {
		t.Fatalf("failed to create files[0] field: %v", err)
	}
	if _, err := file1Writer.Write(file1Data); err != nil {
		t.Fatalf("failed to write file1 data: %v", err)
	}

	file2Writer, err := writer.CreateFormFile("files[1]", "thisisfine.gif")
	if err != nil {
		t.Fatalf("failed to create files[1] field: %v", err)
	}
	if _, err := file2Writer.Write(file2Data); err != nil {
		t.Fatalf("failed to write file2 data: %v", err)
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
		Attachments []struct {
			Filename string `json:"filename"`
		} `json:"attachments"`
		Embeds []struct {
			Image struct {
				URL string `json:"url"`
			} `json:"image"`
		} `json:"embeds"`
	}
	decodeJSONResponse(t, resp, &msgResp)

	if len(msgResp.Attachments) != 2 {
		t.Fatalf("expected 2 attachments, got %d", len(msgResp.Attachments))
	}

	if len(msgResp.Embeds) != 1 {
		t.Fatalf("expected 1 embed, got %d", len(msgResp.Embeds))
	}

	imageURL := msgResp.Embeds[0].Image.URL
	if imageURL == "" {
		t.Error("expected image URL to be populated")
	}
	if !strings.Contains(imageURL, "thisisfine.gif") {
		t.Errorf("expected image URL to contain 'thisisfine.gif', got '%s'", imageURL)
	}
}
