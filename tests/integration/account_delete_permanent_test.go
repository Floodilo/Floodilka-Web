/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
	"time"
)

func TestAccountDeletePermanent(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	friend := createTestAccount(t, client)
	createFriendship(t, client, account, friend)

	resp, err := client.postJSONWithAuth("/users/@me/delete", map[string]string{
		"password": account.Password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to delete account: %v", err)
	}
	assertStatus(t, resp, 204)

	setPendingDeletionAt(t, client, account.UserID, time.Now().Add(-time.Minute))

	triggerDeletionWorker(t, client)

	waitForDeletionCompletion(t, client, account.UserID, 60*time.Second)

	verifyUserDataDeleted(t, client, account.UserID)

	t.Log("Permanent account deletion test passed")
}
