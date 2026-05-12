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

// Login with an invalid invite_code should still succeed and not add guilds.
func TestAuthLoginInviteInvalidCode(t *testing.T) {
	client := newTestClient(t)
	member := createTestAccount(t, client)

	badCode := "invalidcode123"
	loginReq := loginRequest{
		Email:      member.Email,
		Password:   member.Password,
		InviteCode: &badCode,
	}

	resp, err := client.postJSON("/auth/login", loginReq)
	if err != nil {
		t.Fatalf("failed to login with invalid invite: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var loginResp loginResponse
	decodeJSONResponse(t, resp, &loginResp)
	if loginResp.Token == "" {
		t.Fatalf("expected login to return token")
	}
	resp.Body.Close()

	guildsResp, err := client.getWithAuth("/users/@me/guilds", loginResp.Token)
	if err != nil {
		t.Fatalf("failed to fetch guilds: %v", err)
	}
	assertStatus(t, guildsResp, http.StatusOK)
	var guilds []struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, guildsResp, &guilds)
	guildsResp.Body.Close()

	if len(guilds) != 0 {
		t.Fatalf("expected no guilds joined when invite code is invalid, got %d", len(guilds))
	}
}
