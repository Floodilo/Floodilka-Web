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

func TestAuthSessionsAndLogoutEndpoints(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.getWithAuth("/auth/sessions", account.Token)
	if err != nil {
		t.Fatalf("failed to list sessions: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var sessions []authSessionResponse
	decodeJSONResponse(t, resp, &sessions)
	if len(sessions) == 0 {
		t.Fatalf("expected at least one session")
	}

	payload := map[string]any{
		"session_id_hashes": []string{sessions[0].ID},
		"password":          account.Password,
	}
	resp, err = client.postJSONWithAuth("/auth/sessions/logout", payload, account.Token)
	if err != nil {
		t.Fatalf("failed to call sessions logout: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	meResp, err := client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to call /users/@me after logout: %v", err)
	}
	if meResp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected token to be revoked, got status %d: %s", meResp.StatusCode, readResponseBody(meResp))
	}
	meResp.Body.Close()

	account.login(t, client)

	resp, err = client.postJSONWithAuth("/auth/logout", nil, account.Token)
	if err != nil {
		t.Fatalf("failed to call logout: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	meResp, err = client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to call /users/@me post-logout: %v", err)
	}
	if meResp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected unauthorized after logout, got %d", meResp.StatusCode)
	}
	meResp.Body.Close()
}
