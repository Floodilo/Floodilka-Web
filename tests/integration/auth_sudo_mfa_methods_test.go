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

type mfaMethodsResponse struct {
	TOTP     bool `json:"totp"`
	SMS      bool `json:"sms"`
	WebAuthn bool `json:"webauthn"`
	HasMFA   bool `json:"has_mfa"`
}

func TestAuthSudoMFAMethods(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.getWithAuth("/users/@me/sudo/mfa-methods", account.Token)
	if err != nil {
		t.Fatalf("failed to get mfa methods: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var methods mfaMethodsResponse
	decodeJSONResponse(t, resp, &methods)
	if methods.HasMFA {
		t.Fatalf("expected has_mfa=false for user without MFA, got true")
	}
	if methods.TOTP || methods.SMS || methods.WebAuthn {
		t.Fatalf("expected all MFA methods to be false, got totp=%v sms=%v webauthn=%v", methods.TOTP, methods.SMS, methods.WebAuthn)
	}

	secret := newTotpSecret(t)
	resp, err = client.postJSONWithAuth("/users/@me/mfa/totp/enable", map[string]string{
		"secret": secret,
		"code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to enable totp: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var enableResp backupCodesResponse
	decodeJSONResponse(t, resp, &enableResp)
	if len(enableResp.BackupCodes) == 0 {
		t.Fatalf("expected backup codes after enabling totp")
	}

	account.loginWithTotp(t, client, secret)

	resp, err = client.getWithAuth("/users/@me/sudo/mfa-methods", account.Token)
	if err != nil {
		t.Fatalf("failed to get mfa methods after enabling totp: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	decodeJSONResponse(t, resp, &methods)
	if !methods.HasMFA {
		t.Fatalf("expected has_mfa=true after enabling totp")
	}
	if !methods.TOTP {
		t.Fatalf("expected totp=true after enabling totp")
	}
	if methods.SMS || methods.WebAuthn {
		t.Fatalf("expected sms and webauthn to be false, got sms=%v webauthn=%v", methods.SMS, methods.WebAuthn)
	}
}
