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

// Ensures registering a new MFA method does not mint a sudo token, and any
// previously acquired sudo token remains usable afterward.
func TestSudoTokenNotIssuedDuringWebAuthnRegistration(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	device := newWebAuthnDevice(t)

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

	resp, err = client.postJSONWithAuth("/users/@me/mfa/backup-codes", map[string]any{
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
		"regenerate": false,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to fetch backup codes: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("fetch backup codes returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	sudoToken := resp.Header.Get(sudoModeHeader)
	if sudoToken == "" {
		t.Fatalf("expected sudo token after sudo-verified request")
	}
	resp.Body.Close()

	// Request WebAuthn registration options using the existing sudo token.
	var registrationOptions webAuthnRegistrationOptions
	resp, err = client.postJSONWithAuthAndHeaders("/users/@me/mfa/webauthn/credentials/registration-options", map[string]any{}, account.Token, map[string]string{
		sudoModeHeader: sudoToken,
	})
	if err != nil {
		t.Fatalf("failed to request webauthn registration options: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("registration options returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	if header := resp.Header.Get(sudoModeHeader); header != "" {
		t.Fatalf("registration options should not issue sudo token, got %q", header)
	}
	decodeJSONResponse(t, resp, &registrationOptions)
	resp.Body.Close()

	if registrationOptions.RP.ID != "" {
		device.rpID = registrationOptions.RP.ID
	}

	registrationResponse := device.registerResponse(t, registrationOptions)
	resp, err = client.postJSONWithAuthAndHeaders("/users/@me/mfa/webauthn/credentials", map[string]any{
		"response":  registrationResponse,
		"challenge": registrationOptions.Challenge,
		"name":      "Sudo Token Passkey",
	}, account.Token, map[string]string{
		sudoModeHeader: sudoToken,
	})
	if err != nil {
		t.Fatalf("failed to register webauthn credential: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("register webauthn credential returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	if header := resp.Header.Get(sudoModeHeader); header != "" {
		t.Fatalf("registration should not issue sudo token, got %q", header)
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuthAndHeaders("/users/@me/mfa/backup-codes", map[string]any{
		"regenerate": false,
	}, account.Token, map[string]string{
		sudoModeHeader: sudoToken,
	})
	if err != nil {
		t.Fatalf("failed to reuse sudo token after registration: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("backup codes with prior sudo token returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()
}
