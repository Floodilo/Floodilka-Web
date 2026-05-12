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

// TestMfaConsistencyNoMfaUserMfaMethodsEndpoint verifies that the
// /users/@me/sudo/mfa-methods endpoint correctly reports has_mfa=false
// for users without any MFA.
func TestMfaConsistencyNoMfaUserMfaMethodsEndpoint(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.getWithAuth("/users/@me/sudo/mfa-methods", account.Token)
	if err != nil {
		t.Fatalf("failed to get mfa methods: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("mfa methods returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var mfaMethods struct {
		TOTP     bool `json:"totp"`
		SMS      bool `json:"sms"`
		WebAuthn bool `json:"webauthn"`
		HasMFA   bool `json:"has_mfa"`
	}
	decodeJSONResponse(t, resp, &mfaMethods)

	if mfaMethods.HasMFA {
		t.Fatalf("expected has_mfa=false for non-MFA user, got true")
	}
	if mfaMethods.TOTP {
		t.Fatalf("expected totp=false for non-MFA user, got true")
	}
	if mfaMethods.WebAuthn {
		t.Fatalf("expected webauthn=false for non-MFA user, got true")
	}
	if mfaMethods.SMS {
		t.Fatalf("expected sms=false for non-MFA user, got true")
	}

	t.Logf("correctly reported has_mfa=false for non-MFA user")
}
