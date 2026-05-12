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

// TestAuthWebAuthnCredentialDelete validates deleting a WebAuthn credential,
// including sudo verification with WebAuthn.
func TestAuthWebAuthnCredentialDelete(t *testing.T) {
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
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("enable totp returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()
	var registrationOptions webAuthnRegistrationOptions
	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials/registration-options", map[string]any{
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to request registration options: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("registration options returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	decodeJSONResponse(t, resp, &registrationOptions)
	if registrationOptions.RP.ID != "" {
		device.rpID = registrationOptions.RP.ID
	}
	registrationResponse := device.registerResponse(t, registrationOptions)
	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials", map[string]any{
		"response":   registrationResponse,
		"challenge":  registrationOptions.Challenge,
		"name":       "Passkey To Delete",
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to register credential: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("register credential returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me/mfa/webauthn/credentials", account.Token)
	if err != nil {
		t.Fatalf("failed to list credentials: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list credentials returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	var credentials []webAuthnCredentialMetadata
	decodeJSONResponse(t, resp, &credentials)
	if len(credentials) != 1 {
		t.Fatalf("expected 1 credential, got %d", len(credentials))
	}
	credentialID := credentials[0].ID
	resp, err = client.postJSONWithAuth("/users/@me/mfa/totp/disable", map[string]any{
		"code":       totpCodeNow(t, secret),
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to disable totp: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("disable totp returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	// Request sudo WebAuthn challenge
	var sudoWebAuthnOptions webAuthnAuthenticationOptions
	resp, err = client.postJSONWithAuth("/users/@me/sudo/webauthn/authentication-options", map[string]any{}, account.Token)
	if err != nil {
		t.Fatalf("failed to request sudo webauthn options: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("sudo webauthn options returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	decodeJSONResponse(t, resp, &sudoWebAuthnOptions)
	if sudoWebAuthnOptions.RPID != "" {
		device.rpID = sudoWebAuthnOptions.RPID
	}

	sudoAssertion := device.authenticationResponse(t, sudoWebAuthnOptions)

	resp, err = client.deleteJSONWithAuth(fmt.Sprintf("/users/@me/mfa/webauthn/credentials/%s", credentialID), map[string]any{
		"mfa_method":         "webauthn",
		"webauthn_response":  sudoAssertion,
		"webauthn_challenge": sudoWebAuthnOptions.Challenge,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to delete credential: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("delete credential returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me/mfa/webauthn/credentials", account.Token)
	if err != nil {
		t.Fatalf("failed to list credentials after delete: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list credentials returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	decodeJSONResponse(t, resp, &credentials)
	if len(credentials) != 0 {
		t.Fatalf("expected 0 credentials after delete, got %d", len(credentials))
	}
}
