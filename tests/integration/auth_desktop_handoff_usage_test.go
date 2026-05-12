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
)

func TestAuthDesktopHandoffCompleteSingleUse(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	login := loginTestUser(t, client, account.Email, account.Password)

	resp, err := client.postJSON("/auth/handoff/initiate", nil)
	if err != nil {
		t.Fatalf("failed to initiate desktop handoff: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var initResp handoffInitiateResponse
	decodeJSONResponse(t, resp, &initResp)

	resp, err = client.postJSON("/auth/handoff/complete", map[string]string{
		"code":    initResp.Code,
		"token":   login.Token,
		"user_id": login.UserID,
	})
	if err != nil {
		t.Fatalf("failed to complete desktop handoff: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.postJSON("/auth/handoff/complete", map[string]string{
		"code":    initResp.Code,
		"token":   login.Token,
		"user_id": login.UserID,
	})
	if err != nil {
		t.Fatalf("failed to call desktop handoff complete the second time: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected second desktop handoff complete to fail, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.get(fmt.Sprintf("/auth/handoff/%s/status", initResp.Code))
	if err != nil {
		t.Fatalf("failed to poll desktop handoff status: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var status handoffStatusResponse
	decodeJSONResponse(t, resp, &status)
	if status.Status != "completed" {
		t.Fatalf("expected completed status after successful handoff, got %s", status.Status)
	}
	if status.Token == "" {
		t.Fatalf("expected a session token to be returned")
	}
	if status.Token == login.Token {
		t.Fatalf("expected handoff token to be distinct from the original token")
	}

	resp.Body.Close()
}
