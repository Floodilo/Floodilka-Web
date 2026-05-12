/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
	"time"
)

// TestUnclaimedAccountDeleteWithoutPassword verifies that unclaimed accounts
// can delete their accounts without providing a password.
func TestUnclaimedAccountDeleteWithoutPassword(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	unclaimAccount(t, client, account.UserID)

	resp, err := client.postJSONWithAuth("/users/@me/delete", map[string]interface{}{}, account.Token)
	if err != nil {
		t.Fatalf("failed to delete account: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204 for unclaimed account deletion without password, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	setPendingDeletionAt(t, client, account.UserID, time.Now().Add(-time.Minute))
	triggerDeletionWorker(t, client)
	waitForDeletionCompletion(t, client, account.UserID, 60*time.Second)
	verifyUserDataDeleted(t, client, account.UserID)

	t.Log("Unclaimed account deletion without password test passed")
}
