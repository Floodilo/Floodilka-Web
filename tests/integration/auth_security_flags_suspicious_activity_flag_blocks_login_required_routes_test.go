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

func TestSuspiciousActivityFlagBlocksLoginRequiredRoutes(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	updateUserSecurityFlags(t, client, account.UserID, userSecurityFlagsPayload{
		SuspiciousActivityFlagNames: []string{"REQUIRE_VERIFIED_EMAIL"},
	})

	resp, err := client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to fetch /users/@me: %v", err)
	}
	assertStatus(t, resp, http.StatusForbidden)
	resp.Body.Close()

	resp, err = client.postJSONWithAuth("/auth/verify/resend", nil, account.Token)
	if err != nil {
		t.Fatalf("failed to call /auth/verify/resend: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	updateUserSecurityFlags(t, client, account.UserID, userSecurityFlagsPayload{
		SuspiciousActivityFlags: intPtr(0),
	})

	resp, err = client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to fetch /users/@me after clearing flags: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()
}
