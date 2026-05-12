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

func sendChannelMessage(t testing.TB, client *testClient, token string, channelID int64, content string) messageResponse {
	t.Helper()
	ensureSessionStarted(t, client, token)
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), map[string]string{"content": content}, token)
	if err != nil {
		t.Fatalf("failed to send channel message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var msg messageResponse
	decodeJSONResponse(t, resp, &msg)
	return msg
}
