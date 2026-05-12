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

func TestUserDisableAndDeleteEndpoints(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth("/users/@me/disable", map[string]string{"password": account.Password}, account.Token)
	if err != nil {
		t.Fatalf("failed to disable account: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to call /users/@me after disable: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected old token to be invalid after disable, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	login := loginTestUser(t, client, account.Email, account.Password)
	newToken := login.Token

	resp, err = client.postJSONWithAuth("/users/@me/delete", map[string]string{"password": account.Password}, newToken)
	if err != nil {
		t.Fatalf("failed to request self delete: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me", newToken)
	if err != nil {
		t.Fatalf("failed to call /users/@me after delete: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected token to be revoked after delete request, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	loginAfterDelete := loginTestUser(t, client, account.Email, account.Password)
	if loginAfterDelete.Token == "" {
		t.Fatalf("expected ability to log in after delete grace period")
	}
}
