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

func startEmailChange(t testing.TB, client *testClient, account testAccount, password string) emailChangeStartResponse {
	t.Helper()
	resp, err := client.postJSONWithAuth("/users/@me/email-change/start", map[string]any{
		"password": password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to start email change: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	defer resp.Body.Close()
	var start emailChangeStartResponse
	decodeJSONResponse(t, resp, &start)
	return start
}
