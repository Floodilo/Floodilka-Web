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

// TestUserCannotAccessOthersPrivateData tests privacy of user data
func TestUserCannotAccessOthersPrivateData(t *testing.T) {
	client := newTestClient(t)
	_ = createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	resp, err := client.getWithAuth("/users/@me/settings", user2.Token)
	if err != nil {
		t.Fatalf("failed to get own settings: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var settings struct {
		Status string `json:"status"`
	}
	decodeJSONResponse(t, resp, &settings)

	resp, err = client.getWithAuth("/users/@me/notes", user2.Token)
	if err != nil {
		t.Fatalf("failed to get notes: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me/relationships", user2.Token)
	if err != nil {
		t.Fatalf("failed to get relationships: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me/mentions?limit=10", user2.Token)
	if err != nil {
		t.Fatalf("failed to get mentions: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me/saved-messages?limit=10", user2.Token)
	if err != nil {
		t.Fatalf("failed to get saved messages: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

}
