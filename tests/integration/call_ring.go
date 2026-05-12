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

// Helper function to ring call recipients
func ringCall(t *testing.T, client *testClient, token string, channelID int64, recipients []int64) {
	t.Helper()

	body := map[string]any{}
	if len(recipients) > 0 {
		recipientStrs := make([]string, len(recipients))
		for i, r := range recipients {
			recipientStrs[i] = fmt.Sprintf("%d", r)
		}
		body["recipients"] = recipientStrs
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/call/ring", channelID), body, token)
	if err != nil {
		t.Fatalf("failed to ring call: %v", err)
	}
	if resp.StatusCode != 204 {
		t.Fatalf("expected status 204 for ring call, got %d", resp.StatusCode)
	}
}
