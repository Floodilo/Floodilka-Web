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

// TestSudoModePasswordUserRequiresPasswordEachTime verifies that users without MFA
// must provide their password for each sensitive operation and do not receive
// a sudo token that would allow bypassing password verification.
func TestSudoModePasswordUserRequiresPasswordEachTime(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth("/users/@me/disable", map[string]string{
		"password": account.Password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to disable account: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	sudoToken := resp.Header.Get(sudoModeHeader)
	if sudoToken != "" {
		t.Fatalf("password-only users should not receive sudo tokens, but got: %s", sudoToken)
	}
	resp.Body.Close()

	login := loginTestUser(t, client, account.Email, account.Password)
	account.Token = login.Token

	resp, err = client.postJSONWithAuth("/users/@me/disable", map[string]any{}, account.Token)
	if err != nil {
		t.Fatalf("failed to make request: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 for missing password, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var errResp errorResponse
	decodeJSONResponse(t, resp, &errResp)
	if errResp.Code != "SUDO_MODE_REQUIRED" {
		t.Fatalf("expected SUDO_MODE_REQUIRED error code, got: %s", errResp.Code)
	}
}
