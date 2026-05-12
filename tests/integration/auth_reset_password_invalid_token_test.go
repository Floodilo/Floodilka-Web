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

// Covers invalid/expired reset token path.
func TestAuthResetPasswordInvalidToken(t *testing.T) {
	client := newTestClient(t)
	_ = createTestAccount(t, client)

	resp, err := client.postJSON("/auth/reset", map[string]string{
		"token":    "invalid-reset-token",
		"password": uniquePassword(),
	})
	if err != nil {
		t.Fatalf("failed to call reset password: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected invalid token to fail, got 200")
	}
	assertStatus(t, resp, http.StatusBadRequest)
	resp.Body.Close()
}
