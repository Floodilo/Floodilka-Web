/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
)

// Helper function to get channel messages
func getChannelMessages(t *testing.T, client *testClient, token string, channelID int64, limit int) []callMessageResponse {
	t.Helper()

	resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages?limit=%d", channelID, limit), token)
	if err != nil {
		t.Fatalf("failed to get channel messages: %v", err)
	}

	var messages []callMessageResponse
	decodeJSONResponse(t, resp, &messages)
	return messages
}
