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

func seedMfaTicket(t testing.TB, client *testClient, ticket, userID string, ttlSeconds int) {
	t.Helper()

	resp, err := client.postJSON("/test/auth/mfa-ticket", map[string]any{
		"ticket":      ticket,
		"user_id":     userID,
		"ttl_seconds": ttlSeconds,
	})
	if err != nil {
		t.Fatalf("failed to seed mfa ticket: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("seed mfa ticket returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
