/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"bytes"
	"fmt"
	"mime/multipart"
	"net/http"
	"testing"
)

// TestAttachmentUpload_StringIDCoercion tests that string IDs are coerced to numbers
func TestAttachmentUpload_StringIDCoercion(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "String ID Coercion Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	fileData := []byte("test content")

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	payloadStr := `{"content":"test","attachments":[{"id":"0","filename":"test.txt","flags":"0"}]}`

	if err := writer.WriteField("payload_json", payloadStr); err != nil {
		t.Fatalf("failed to write payload_json field: %v", err)
	}

	fileWriter, err := writer.CreateFormFile("files[0]", "test.txt")
	if err != nil {
		t.Fatalf("failed to create file field: %v", err)
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
		Attachments []struct {
			Filename string `json:"filename"`
			Flags    int    `json:"flags"`
		} `json:"attachments"`
	}
	decodeJSONResponse(t, resp, &msgResp)

	if len(msgResp.Attachments) != 1 {
		t.Fatalf("expected 1 attachment, got %d", len(msgResp.Attachments))
	}

	if msgResp.Attachments[0].Filename != "test.txt" {
		t.Errorf("expected filename 'test.txt', got %q", msgResp.Attachments[0].Filename)
	}
}
