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
	"time"
)

// TestSystemUserNeverScheduledForDeletion verifies that system user accounts
// are never scheduled for inactivity-based deletion.
func TestSystemUserNeverScheduledForDeletion(t *testing.T) {
	client := newTestClient(t)

	systemUser := createTestAccount(t, client)

	setSystemFlag(t, client, systemUser.UserID, true)

	threeYearsAgo := time.Now().AddDate(-3, 0, 0)
	setLastActiveAt(t, client, systemUser.UserID, threeYearsAgo)

	clearTestEmails(t, client)

	workerResp := triggerInactivityWorker(t, client)

	if workerResp.WarningsSent > 0 {
		t.Errorf("expected no warnings sent for system user, got %d", workerResp.WarningsSent)
	}

	if workerResp.DeletionsScheduled > 0 {
		t.Errorf("expected no deletions scheduled for system user, got %d", workerResp.DeletionsScheduled)
	}

	dataResp, err := client.get(fmt.Sprintf("/test/users/%s/data-exists", systemUser.UserID))
	if err != nil {
		t.Fatalf("failed to check system user data: %v", err)
	}
	defer dataResp.Body.Close()

	var data userDataExistsResponse
	decodeJSONResponse(t, dataResp, &data)

	if data.PendingDeletionAt != nil {
		t.Error("expected system user to not have pending_deletion_at, but it was set")
	}

	t.Log("System user immunity test passed")
}
