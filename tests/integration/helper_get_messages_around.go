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

// getChannelMessagesAround fetches messages centered around a specific message ID
func getChannelMessagesAround(t *testing.T, client *testClient, token string, channelID int64, around string, limit int) []callMessageResponse {
	t.Helper()

	url := fmt.Sprintf("/channels/%d/messages?around=%s&limit=%d", channelID, around, limit)
	resp, err := client.getWithAuth(url, token)
	if err != nil {
		t.Fatalf("failed to get channel messages around: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var messages []callMessageResponse
	decodeJSONResponse(t, resp, &messages)
	return messages
}
