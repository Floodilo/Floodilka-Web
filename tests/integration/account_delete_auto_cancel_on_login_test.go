/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

func TestAccountDeleteAutoCancelOnLogin(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth("/users/@me/delete", map[string]string{
		"password": account.Password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to delete account: %v", err)
	}
	assertStatus(t, resp, 204)

	loginResp := loginTestUser(t, client, account.Email, account.Password)
	if loginResp.Token == "" {
		t.Fatal("expected to be able to login")
	}

	dataResp, err := client.get("/test/users/" + loginResp.UserID + "/data-exists")
	if err != nil {
		t.Fatalf("failed to check user data: %v", err)
	}
	defer dataResp.Body.Close()

	var dataExists userDataExistsResponse
	decodeJSONResponse(t, dataResp, &dataExists)

	if dataExists.HasSelfDeletedFlag {
		t.Error("expected SELF_DELETED flag to be removed after login")
	}

	if dataExists.PendingDeletionAt != nil {
		t.Error("expected pending_deletion_at to be cleared after login")
	}

	t.Log("Auto-cancel deletion on login test passed")
}
