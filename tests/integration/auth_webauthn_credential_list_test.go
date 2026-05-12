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

// TestAuthWebAuthnCredentialList validates listing all WebAuthn credentials for a user,
// including the case with no credentials and multiple credentials.
func TestAuthWebAuthnCredentialList(t *testing.T) {
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
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("enable totp returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me/mfa/webauthn/credentials", account.Token)
	if err != nil {
		t.Fatalf("failed to list credentials: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list credentials returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	var emptyCredentials []webAuthnCredentialMetadata
	decodeJSONResponse(t, resp, &emptyCredentials)
	if len(emptyCredentials) != 0 {
		t.Fatalf("expected 0 credentials, got %d", len(emptyCredentials))
	}
	device1 := newWebAuthnDevice(t)
	var registrationOptions1 webAuthnRegistrationOptions
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
	decodeJSONResponse(t, resp, &registrationOptions1)
	if registrationOptions1.RP.ID != "" {
		device1.rpID = registrationOptions1.RP.ID
	}
	registrationResponse1 := device1.registerResponse(t, registrationOptions1)
	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials", map[string]any{
		"response":   registrationResponse1,
		"challenge":  registrationOptions1.Challenge,
		"name":       "First Passkey",
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to register first credential: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("register first credential returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()
	device2 := newWebAuthnDevice(t)
	var registrationOptions2 webAuthnRegistrationOptions
	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials/registration-options", map[string]any{
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to request second registration options: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("second registration options returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	decodeJSONResponse(t, resp, &registrationOptions2)
	if registrationOptions2.RP.ID != "" {
		device2.rpID = registrationOptions2.RP.ID
	}
	registrationResponse2 := device2.registerResponse(t, registrationOptions2)
	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials", map[string]any{
		"response":   registrationResponse2,
		"challenge":  registrationOptions2.Challenge,
		"name":       "Second Passkey",
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to register second credential: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("register second credential returned %d: %s", resp.StatusCode, readResponseBody(resp))
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

	if len(credentials) != 2 {
		t.Fatalf("expected 2 credentials, got %d", len(credentials))
	}

	foundFirst := false
	foundSecond := false
	for _, cred := range credentials {
		if cred.Name == "First Passkey" && cred.ID == encodeBase64URL(device1.credentialID) {
			foundFirst = true
		}
		if cred.Name == "Second Passkey" && cred.ID == encodeBase64URL(device2.credentialID) {
			foundSecond = true
		}
	}
	if !foundFirst {
		t.Fatal("first passkey not found in credentials list")
	}
	if !foundSecond {
		t.Fatal("second passkey not found in credentials list")
	}
}
