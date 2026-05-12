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

// Ensures WebAuthn auth fails when challenge is tampered.
func TestAuthWebAuthnAuthenticationWrongChallenge(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	device := newWebAuthnDevice(t)

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

	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials/registration-options", map[string]any{
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to request registration options: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var regOpts webAuthnRegistrationOptions
	decodeJSONResponse(t, resp, &regOpts)
	resp.Body.Close()

	if regOpts.RP.ID != "" {
		device.rpID = regOpts.RP.ID
	}

	regResp := device.registerResponse(t, regOpts)
	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials", map[string]any{
		"response":   regResp,
		"challenge":  regOpts.Challenge,
		"name":       "WrongChallenge",
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to register credential: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.postJSON("/auth/webauthn/authentication-options", nil)
	if err != nil {
		t.Fatalf("failed to request auth options: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var authOpts webAuthnAuthenticationOptions
	decodeJSONResponse(t, resp, &authOpts)
	resp.Body.Close()

	if authOpts.RPID != "" {
		device.rpID = authOpts.RPID
	}

	assertion := device.authenticationResponse(t, authOpts)

	badChallenge := authOpts.Challenge + "-tampered"
	resp, err = client.postJSON("/auth/webauthn/authenticate", map[string]any{
		"response":  assertion,
		"challenge": badChallenge,
	})
	if err != nil {
		t.Fatalf("failed to call webauthn auth with bad challenge: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected tampered challenge to fail, got 200")
	}
	resp.Body.Close()
}
