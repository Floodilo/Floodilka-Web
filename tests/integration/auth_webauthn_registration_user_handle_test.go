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

// TestAuthWebAuthnRegistrationUserHandle ensures registration options carry the
// stable user identifier so authenticators bind passkeys to the correct account.
func TestAuthWebAuthnRegistrationUserHandle(t *testing.T) {
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

	resp, err = client.postJSONWithAuth("/users/@me/mfa/webauthn/credentials/registration-options", map[string]any{
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to request registration options: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var options webAuthnRegistrationOptions
	decodeJSONResponse(t, resp, &options)

	handle := string(decodeBase64URL(t, options.User.ID))
	if handle != account.UserID {
		t.Fatalf("expected user handle %s, got %s", account.UserID, handle)
	}
}
