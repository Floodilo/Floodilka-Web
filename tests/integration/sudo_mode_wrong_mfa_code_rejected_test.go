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

// TestSudoModeWrongMfaCodeRejected verifies that incorrect MFA codes
// are rejected during sudo verification, preventing brute force attacks.
func TestSudoModeWrongMfaCodeRejected(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	secret := newTotpSecret(t)
	resp, err := client.postJSONWithAuth("/users/@me/mfa/totp/enable", map[string]string{
		"secret": secret,
		"code":   totpCodePrev(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to enable totp: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("enable totp returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	loginResp, err := client.postJSON("/auth/login", loginRequest{
		Email:    account.Email,
		Password: account.Password,
	})
	if err != nil {
		t.Fatalf("failed to login: %v", err)
	}
	var login loginResponse
	decodeJSONResponse(t, loginResp, &login)

	resp, err = client.postJSON("/auth/login/mfa/totp", map[string]string{
		"code":   totpCodeNow(t, secret),
		"ticket": login.Ticket,
	})
	if err != nil {
		t.Fatalf("failed to complete MFA login: %v", err)
	}
	var mfaLogin mfaLoginResponse
	decodeJSONResponse(t, resp, &mfaLogin)
	account.Token = mfaLogin.Token

	wrongCodes := []string{
		"000000",
		"123456",
		"999999",
		"12345",
		"1234567",
		"abcdef",
	}

	for _, wrongCode := range wrongCodes {
		resp, err := client.postJSONWithAuth("/users/@me/disable", map[string]string{
			"mfa_method": "totp",
			"mfa_code":   wrongCode,
		}, account.Token)
		if err != nil {
			t.Fatalf("failed to make request with wrong MFA code: %v", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 for wrong MFA code %q, got %d: %s", wrongCode, resp.StatusCode, readResponseBody(resp))
		}
		resp.Body.Close()
	}

	t.Logf("all incorrect MFA codes were correctly rejected")
}
