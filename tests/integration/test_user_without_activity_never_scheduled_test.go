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

// TestUserWithoutActivityNeverScheduled verifies that users with no
// last_active_at value are never scheduled for inactivity-based deletion,
// as they have no activity tracking data.
func TestUserWithoutActivityNeverScheduled(t *testing.T) {
	client := newTestClient(t)

	user := createTestAccount(t, client)

	clearTestEmails(t, client)

	workerResp := triggerInactivityWorker(t, client)

	if workerResp.WarningsSent > 0 {
		t.Errorf("expected no warnings sent for user without activity, got %d", workerResp.WarningsSent)
	}

	if workerResp.DeletionsScheduled > 0 {
		t.Errorf("expected no deletions scheduled for user without activity, got %d", workerResp.DeletionsScheduled)
	}

	dataResp, err := client.get(fmt.Sprintf("/test/users/%s/data-exists", user.UserID))
	if err != nil {
		t.Fatalf("failed to check user data: %v", err)
	}
	defer dataResp.Body.Close()

	var data userDataExistsResponse
	decodeJSONResponse(t, dataResp, &data)

	if data.PendingDeletionAt != nil {
		t.Error("expected user without activity to not have pending_deletion_at, but it was set")
	}

	t.Log("No-activity immunity test passed")
}
