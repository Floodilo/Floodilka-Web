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

// TestBotNeverScheduledForInactivityDeletion verifies that bot accounts
// are never scheduled for inactivity-based deletion, regardless of their
// inactivity status.
func TestBotNeverScheduledForInactivityDeletion(t *testing.T) {
	client := newTestClient(t)

	bot := createTestAccount(t, client)

	setBotFlag(t, client, bot.UserID, true)

	threeYearsAgo := time.Now().AddDate(-3, 0, 0)
	setLastActiveAt(t, client, bot.UserID, threeYearsAgo)

	clearTestEmails(t, client)

	workerResp := triggerInactivityWorker(t, client)

	if workerResp.WarningsSent > 0 {
		t.Errorf("expected no warnings sent for bot, got %d", workerResp.WarningsSent)
	}

	if workerResp.DeletionsScheduled > 0 {
		t.Errorf("expected no deletions scheduled for bot, got %d", workerResp.DeletionsScheduled)
	}

	dataResp, err := client.get(fmt.Sprintf("/test/users/%s/data-exists", bot.UserID))
	if err != nil {
		t.Fatalf("failed to check bot data: %v", err)
	}
	defer dataResp.Body.Close()

	var data userDataExistsResponse
	decodeJSONResponse(t, dataResp, &data)

	if data.PendingDeletionAt != nil {
		t.Error("expected bot to not have pending_deletion_at, but it was set")
	}

	t.Log("Bot immunity test passed")
}
