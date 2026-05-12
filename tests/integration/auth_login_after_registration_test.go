/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"testing"
	"time"
)

func TestAuthLoginAfterRegistration(t *testing.T) {
	client := newTestClient(t)

	email := fmt.Sprintf("integration-login-%d@example.com", time.Now().UnixNano())
	password := uniquePassword()

	reg := registerTestUser(t, client, email, password)

	loginReq := loginRequest{
		Email:    email,
		Password: password,
	}

	resp, err := client.postJSON("/auth/login", loginReq)
	if err != nil {
		t.Fatalf("failed to call login endpoint: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("login returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var loginResp loginResponse
	decodeJSONResponse(t, resp, &loginResp)

	if loginResp.MFA {
		t.Fatalf("expected MFA to be false for fresh account")
	}
	if loginResp.Token == "" {
		t.Fatalf("expected login response to include token")
	}
	if loginResp.UserID != reg.UserID {
		t.Fatalf("expected login user_id %s to match registration %s", loginResp.UserID, reg.UserID)
	}
}
