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

func requestNewEmailChange(t testing.TB, client *testClient, account testAccount, ticket, newEmail, originalProof, password string) emailChangeRequestNewResponse {
	t.Helper()
	resp, err := client.postJSONWithAuth("/users/@me/email-change/request-new", map[string]any{
		"ticket":         ticket,
		"new_email":      newEmail,
		"original_proof": originalProof,
		"password":       password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to request new email: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	defer resp.Body.Close()
	var parsed emailChangeRequestNewResponse
	decodeJSONResponse(t, resp, &parsed)
	return parsed
}
