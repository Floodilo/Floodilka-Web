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

// Covers password reset flow when MFA is enabled: returns ticket then succeeds with TOTP.
func TestAuthResetPasswordRequiresMfa(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	clearTestEmails(t, client)

	secret := newTotpSecret(t)
	resp, err := client.postJSONWithAuth("/users/@me/mfa/totp/enable", map[string]string{
		"secret": secret,
		"code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to enable totp: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.postJSON("/auth/forgot", map[string]string{"email": account.Email})
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
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected reset to require mfa but still 200 payload; got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var resetResp loginResponse
	decodeJSONResponse(t, resp, &resetResp)
	if !resetResp.MFA || resetResp.Ticket == "" {
		t.Fatalf("expected reset to return mfa ticket")
	}
	resp.Body.Close()

	resp, err = client.postJSON("/auth/login/mfa/totp", map[string]string{
		"ticket": resetResp.Ticket,
		"code":   totpCodeNow(t, secret),
	})
	if err != nil {
		t.Fatalf("failed to complete mfa after reset: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var mfaResp mfaLoginResponse
	decodeJSONResponse(t, resp, &mfaResp)
	if mfaResp.Token == "" {
		t.Fatalf("expected mfa completion to return token")
	}
	resp.Body.Close()

	login := loginTestUserWithTotp(t, client, account.Email, newPassword, secret)
	if login.Token == "" {
		t.Fatalf("expected login with new password to succeed")
	}
}
