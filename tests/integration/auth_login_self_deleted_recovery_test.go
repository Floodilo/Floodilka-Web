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

// Covers auto-recovery for self-deleted accounts with pending deletion.
func TestAuthLoginSelfDeletedRecovery(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	setPendingDeletion(t, client, account.UserID, time.Now().Add(-1*time.Hour), true)

	resp, err := client.postJSON("/auth/login", loginRequest{
		Email:    account.Email,
		Password: account.Password,
	})
	if err != nil {
		t.Fatalf("failed to login after marking self-deleted: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	statusResp, err := client.getWithAuth("/test/users/"+account.UserID+"/data-exists", account.Token)
	if err != nil {
		t.Fatalf("failed to fetch data-exists: %v", err)
	}
	if statusResp.StatusCode != http.StatusOK {
		t.Fatalf("data-exists returned %d: %s", statusResp.StatusCode, readResponseBody(statusResp))
	}
	var payload struct {
		PendingDeletionAt  *string `json:"pending_deletion_at"`
		HasSelfDeletedFlag bool    `json:"has_self_deleted_flag"`
		HasDeletedFlag     bool    `json:"has_deleted_flag"`
	}
	decodeJSONResponse(t, statusResp, &payload)
	if payload.PendingDeletionAt != nil {
		t.Fatalf("expected pending_deletion_at to be cleared, got %v", *payload.PendingDeletionAt)
	}
	if payload.HasSelfDeletedFlag {
		t.Fatalf("expected SELF_DELETED flag to be cleared")
	}
	if payload.HasDeletedFlag {
		t.Fatalf("expected DELETED flag to be false")
	}
	statusResp.Body.Close()
}
