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

// Completes login for TOTP-enabled users by following the MFA ticket flow.
// Falls back to the standard login response if MFA is not required.
func loginTestUserWithTotp(t testing.TB, client *testClient, email, password, totpSecret string) loginResponse {
	t.Helper()

	loginResp := loginTestUser(t, client, email, password)
	if !loginResp.MFA {
		if loginResp.Token == "" {
			t.Fatalf("expected token in non-MFA login response")
		}
		return loginResp
	}

	if loginResp.Ticket == "" {
		t.Fatalf("expected mfa ticket in login response")
	}

	resp, err := client.postJSON("/auth/login/mfa/totp", map[string]string{
		"ticket": loginResp.Ticket,
		"code":   totpCodeNow(t, totpSecret),
	})
	if err != nil {
		t.Fatalf("failed to complete totp login: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("totp login returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var mfaResp mfaLoginResponse
	decodeJSONResponse(t, resp, &mfaResp)
	if mfaResp.Token == "" {
		t.Fatalf("expected token in totp login response")
	}

	return loginResponse{
		MFA:    false,
		UserID: loginResp.UserID,
		Token:  mfaResp.Token,
	}
}
