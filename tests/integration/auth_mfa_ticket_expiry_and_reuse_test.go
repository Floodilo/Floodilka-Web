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
	"time"
)

// Covers MFA ticket expiry and reuse rejection for TOTP.
func TestAuthMfaTicketExpiryAndReuse(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

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

	expiredTicket := fmt.Sprintf("expired-%d", time.Now().UnixNano())
	seedMfaTicket(t, client, expiredTicket, account.UserID, 1)
	time.Sleep(2 * time.Second)

	resp, err = client.postJSON("/auth/login/mfa/totp", map[string]string{
		"ticket": expiredTicket,
		"code":   totpCodeNow(t, secret),
	})
	if err != nil {
		t.Fatalf("failed to call login mfa totp with expired ticket: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected expired ticket to fail, got 200")
	}
	resp.Body.Close()

	validTicket := fmt.Sprintf("valid-%d", time.Now().UnixNano())
	seedMfaTicket(t, client, validTicket, account.UserID, 300)

	resp, err = client.postJSON("/auth/login/mfa/totp", map[string]string{
		"ticket": validTicket,
		"code":   totpCodeNow(t, secret),
	})
	if err != nil {
		t.Fatalf("failed to call login mfa totp: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.postJSON("/auth/login/mfa/totp", map[string]string{
		"ticket": validTicket,
		"code":   totpCodeNow(t, secret),
	})
	if err != nil {
		t.Fatalf("failed to call login mfa totp reuse: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected reused ticket to fail")
	}
	resp.Body.Close()
}
