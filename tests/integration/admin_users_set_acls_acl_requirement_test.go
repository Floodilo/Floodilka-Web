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

func TestAdminUsersSetAclsRequiresAclSetUser(t *testing.T) {
	client := newTestClient(t)
	admin := createTestAccount(t, client)
	setUserACLs(t, client, admin.UserID, []string{"admin:authenticate", "user:update:flags"})

	target := createTestAccount(t, client)
	payload := map[string]any{
		"user_id": target.UserID,
		"acls":    []string{"user:update:flags"},
	}

	unauthorizedResp, err := client.postJSONWithAuth("/admin/users/set-acls", payload, admin.Token)
	if err != nil {
		t.Fatalf("failed to call set-acls without acl:set:user: %v", err)
	}
	if unauthorizedResp.StatusCode != http.StatusForbidden {
		t.Fatalf(
			"expected 403 when missing acl:set:user, got %d: %s",
			unauthorizedResp.StatusCode,
			readResponseBody(unauthorizedResp),
		)
	}
	unauthorizedResp.Body.Close()

	setUserACLs(t, client, admin.UserID, []string{"admin:authenticate", "acl:set:user"})

	authorizedResp, err := client.postJSONWithAuth("/admin/users/set-acls", payload, admin.Token)
	if err != nil {
		t.Fatalf("failed to call set-acls with acl:set:user: %v", err)
	}
	if authorizedResp.StatusCode != http.StatusOK {
		t.Fatalf(
			"expected 200 when acl:set:user is present, got %d: %s",
			authorizedResp.StatusCode,
			readResponseBody(authorizedResp),
		)
	}
	authorizedResp.Body.Close()
}
