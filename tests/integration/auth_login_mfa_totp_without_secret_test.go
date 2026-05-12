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

// Users without totpSecret should bypass TOTP check and still get a token.
func TestAuthLoginMfaTotpWithoutSecretReturnsSession(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	ticket := "mfa-no-secret"
	seedMfaTicket(t, client, ticket, account.UserID, 300)

	resp, err := client.postJSON("/auth/login/mfa/totp", map[string]string{
		"ticket": ticket,
		"code":   "123456",
	})
	if err != nil {
		t.Fatalf("failed to call login mfa totp: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var loginResp loginResponse
	decodeJSONResponse(t, resp, &loginResp)
	if loginResp.Token == "" {
		t.Fatalf("expected token for user without totpSecret")
	}
	resp.Body.Close()
}
