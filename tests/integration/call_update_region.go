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

// Helper function to update call region
func updateCallRegion(t *testing.T, client *testClient, token string, channelID int64, region string) {
	t.Helper()

	body := map[string]any{"region": region}
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/call", channelID), body, token)
	if err != nil {
		t.Fatalf("failed to update call region: %v", err)
	}
	if resp.StatusCode != 204 {
		t.Fatalf("expected status 204 for update call region, got %d", resp.StatusCode)
	}
}
