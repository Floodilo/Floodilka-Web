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

// Covers reset token reuse rejection and session invalidation after password reset.
func TestAuthResetTokenReuseIsRejectedAndOldSessionsInvalidated(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	clearTestEmails(t, client)

	resp, err := client.postJSON("/auth/forgot", map[string]string{"email": account.Email})
	if err != nil {
		t.Fatalf("failed to call forgot password: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	email := waitForEmail(t, client, "password_reset", account.Email)
	token, ok := email.Metadata["token"]
	if !ok || token == "" {
		t.Fatalf("expected password reset token in email metadata")
	}

	newPassword := uniquePassword()
	resp, err = client.postJSON("/auth/reset", map[string]string{"token": token, "password": newPassword})
	if err != nil {
		t.Fatalf("failed to call reset password: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var resetResp loginResponse
	decodeJSONResponse(t, resp, &resetResp)
	if resetResp.Token == "" {
		t.Fatalf("expected reset to return a new token")
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to call users/@me with old token: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected old token to be invalid after password reset")
	}
	resp.Body.Close()

	anotherPassword := uniquePassword()
	resp, err = client.postJSON("/auth/reset", map[string]string{"token": token, "password": anotherPassword})
	if err != nil {
		t.Fatalf("failed to call reset password with reused token: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected reset with reused token to fail")
	}
	assertStatus(t, resp, http.StatusBadRequest)
	resp.Body.Close()

	login := loginTestUser(t, client, account.Email, newPassword)
	if login.Token == "" {
		t.Fatalf("expected login with latest password to succeed")
	}
}
