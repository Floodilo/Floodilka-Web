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

func verifyNewEmailChange(t testing.TB, client *testClient, account testAccount, ticket, code, originalProof, password string) string {
	t.Helper()
	resp, err := client.postJSONWithAuth("/users/@me/email-change/verify-new", map[string]any{
		"ticket":         ticket,
		"code":           code,
		"original_proof": originalProof,
		"password":       password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to verify new email: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	defer resp.Body.Close()
	var parsed emailChangeVerifyNewResponse
	decodeJSONResponse(t, resp, &parsed)
	if parsed.EmailToken == "" {
		t.Fatalf("expected email_token in response")
	}
	return parsed.EmailToken
}
