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

func loginTestUser(t testing.TB, client *testClient, email, password string) loginResponse {
	t.Helper()

	req := loginRequest{
		Email:    email,
		Password: password,
	}

	resp, err := client.postJSON("/auth/login", req)
	if err != nil {
		t.Fatalf("failed to call login endpoint: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("login returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var loginResp loginResponse
	decodeJSONResponse(t, resp, &loginResp)
	return loginResp
}
