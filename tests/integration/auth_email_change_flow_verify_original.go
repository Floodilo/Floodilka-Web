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

func verifyOriginalEmailChange(t testing.TB, client *testClient, account testAccount, ticket, code, password string) string {
	t.Helper()
	resp, err := client.postJSONWithAuth("/users/@me/email-change/verify-original", map[string]any{
		"ticket":   ticket,
		"code":     code,
		"password": password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to verify original email: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	defer resp.Body.Close()
	var parsed emailChangeVerifyOriginalResponse
	decodeJSONResponse(t, resp, &parsed)
	if parsed.OriginalProof == "" {
		t.Fatalf("expected original_proof in response")
	}
	return parsed.OriginalProof
}
