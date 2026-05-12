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
	"time"
)

// setPendingDeletionAt forces a user's pending_deletion_at timestamp via the test
// harness so deletion-related flows can be exercised without long delays.
func setPendingDeletionAt(t testing.TB, client *testClient, userID string, when time.Time) {
	t.Helper()

	endpoint := fmt.Sprintf("/test/users/%s/set-pending-deletion", userID)
	resp, err := client.postJSON(endpoint, map[string]any{
		"pending_deletion_at": when.UTC().Format(time.RFC3339),
	})
	if err != nil {
		t.Fatalf("failed to set pending deletion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("set pending deletion returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
