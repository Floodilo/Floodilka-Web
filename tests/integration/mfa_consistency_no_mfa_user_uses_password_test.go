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

// TestMfaConsistencyNoMfaUserUsesPassword verifies that users without any MFA
// can use their password for sudo verification, but do NOT receive a sudo token.
func TestMfaConsistencyNoMfaUserUsesPassword(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth("/users/@me/disable", map[string]string{
		"password": account.Password,
	}, account.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204 for non-MFA user with password, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	sudoToken := resp.Header.Get(sudoModeHeader)
	if sudoToken != "" {
		t.Fatalf("expected no sudo token for non-MFA user, but got one")
	}

	t.Logf("correctly allowed password for non-MFA user without issuing sudo token")
}
