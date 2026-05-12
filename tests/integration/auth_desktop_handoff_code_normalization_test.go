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
	"strings"
	"testing"
)

// TestAuthDesktopHandoffCodeNormalization tests that codes work with or without dashes
// and are case-insensitive
func TestAuthDesktopHandoffCodeNormalization(t *testing.T) {
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

	if !validateHandoffCodeFormat(initResp.Code) {
		t.Fatalf("expected code in XXXX-XXXX format, got %s", initResp.Code)
	}

	codeWithoutDash := strings.ReplaceAll(initResp.Code, "-", "")
	statusURL := fmt.Sprintf("/auth/handoff/%s/status", codeWithoutDash)
	resp, err = client.get(statusURL)
	if err != nil {
		t.Fatalf("failed to poll status with code without dash: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var status handoffStatusResponse
	decodeJSONResponse(t, resp, &status)
	if status.Status != "pending" {
		t.Fatalf("expected pending status, got %s", status.Status)
	}

	lowercaseCode := strings.ToLower(initResp.Code)
	resp, err = client.postJSON("/auth/handoff/complete", map[string]string{
		"code":    lowercaseCode,
		"token":   login.Token,
		"user_id": login.UserID,
	})
	if err != nil {
		t.Fatalf("failed to complete handoff with lowercase code: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.get(fmt.Sprintf("/auth/handoff/%s/status", initResp.Code))
	if err != nil {
		t.Fatalf("failed to poll completed handoff status: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	decodeJSONResponse(t, resp, &status)
	if status.Status != "completed" {
		t.Fatalf("expected completed status, got %s", status.Status)
	}
	if status.Token == "" {
		t.Fatalf("expected token in completed status")
	}
	if status.Token == login.Token {
		t.Fatalf("expected handoff token to be a new session token")
	}
}
