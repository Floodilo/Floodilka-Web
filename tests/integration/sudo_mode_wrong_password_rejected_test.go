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

// TestSudoModeWrongPasswordRejected verifies that incorrect passwords
// are rejected during sudo verification, preventing brute force attacks.
func TestSudoModeWrongPasswordRejected(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	wrongPasswords := []string{
		"wrong-password",
		"",
		account.Password + "extra",
		"password123",
	}

	for _, wrongPassword := range wrongPasswords {
		var payload map[string]string
		if wrongPassword == "" {
			payload = map[string]string{}
		} else {
			payload = map[string]string{"password": wrongPassword}
		}

		resp, err := client.postJSONWithAuth("/users/@me/disable", payload, account.Token)
		if err != nil {
			t.Fatalf("failed to make request with wrong password: %v", err)
		}

		if wrongPassword == "" {
			if resp.StatusCode != http.StatusForbidden {
				t.Fatalf("expected 403 for empty password, got %d: %s", resp.StatusCode, readResponseBody(resp))
			}
			var errResp errorResponse
			decodeJSONResponse(t, resp, &errResp)
			if errResp.Code != "SUDO_MODE_REQUIRED" {
				t.Fatalf("expected SUDO_MODE_REQUIRED for empty password, got: %s", errResp.Code)
			}
		} else {
			if resp.StatusCode != http.StatusBadRequest {
				t.Fatalf("expected 400 for wrong password %q, got %d: %s", wrongPassword, resp.StatusCode, readResponseBody(resp))
			}
		}

		resp.Body.Close()
	}

	t.Logf("all incorrect passwords were correctly rejected")
}
