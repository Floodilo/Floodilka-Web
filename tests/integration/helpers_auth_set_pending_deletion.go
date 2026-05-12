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

func setPendingDeletion(t testing.TB, client *testClient, userID string, at time.Time, setSelfDeletedFlag bool) {
	t.Helper()

	resp, err := client.postJSON(fmt.Sprintf("/test/users/%s/set-pending-deletion", userID), map[string]any{
		"pending_deletion_at":   at.Format(time.RFC3339),
		"set_self_deleted_flag": setSelfDeletedFlag,
	})
	if err != nil {
		t.Fatalf("failed to set pending deletion: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("set pending deletion returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
