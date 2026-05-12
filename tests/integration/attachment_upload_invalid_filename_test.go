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
	"testing"
)

// TestAttachmentUpload_InvalidFilename tests that invalid filenames are rejected
func TestAttachmentUpload_InvalidFilename(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Invalid Filename Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	fileData, err := fixturesFS.ReadFile("fixtures/yeah.png")
	if err != nil {
		t.Fatalf("failed to read fixture: %v", err)
	}

	testCases := []struct {
		name     string
		filename string
	}{
		{"empty filename", ""},
		{"filename too long", string(make([]byte, 300))},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			var body bytes.Buffer
			writer := multipart.NewWriter(&body)

			payload := map[string]any{
				"content": "Invalid filename test",
				"attachments": []map[string]any{
					{
						"id":       0,
						"filename": tc.filename,
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

			fileWriter, err := writer.CreateFormFile("files[0]", tc.filename)
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

			if resp.StatusCode == http.StatusOK {
				t.Error("expected request to fail with invalid filename, but it succeeded")
			}
		})
	}
}
