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
)

// Covers auto-clearing of DISABLED flag on login (when not temp-banned).
func TestAuthLoginDisabledFlagRecovery(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	updateUserSecurityFlags(t, client, account.UserID, userSecurityFlagsPayload{
		SetFlags: []string{"DISABLED"},
	})

	resp, err := client.postJSON("/auth/login", loginRequest{
		Email:    account.Email,
		Password: account.Password,
	})
	if err != nil {
		t.Fatalf("failed to login with disabled flag: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	statusResp, err := client.getWithAuth("/test/users/"+account.UserID+"/data-exists", account.Token)
	if err != nil {
		t.Fatalf("failed to fetch data-exists: %v", err)
	}
	assertStatus(t, statusResp, http.StatusOK)
	var payload struct {
		HasSelfDeletedFlag bool   `json:"has_self_deleted_flag"`
		HasDeletedFlag     bool   `json:"has_deleted_flag"`
		Flags              string `json:"flags"`
	}
	decodeJSONResponse(t, statusResp, &payload)
	if payload.HasDeletedFlag || payload.HasSelfDeletedFlag {
		t.Fatalf("expected DELETED/SELF_DELETED to be false")
	}
	if payload.Flags == "" {
		statusResp.Body.Close()
		return
	}
	if payload.Flags == "2" {
		t.Fatalf("expected DISABLED flag to be cleared, got flags=%s", payload.Flags)
	}
	statusResp.Body.Close()
}
