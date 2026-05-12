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
)

func setUserACLs(t testing.TB, client *testClient, userID string, acls []string) {
	t.Helper()

	resp, err := client.postJSON(fmt.Sprintf("/test/users/%s/acls", userID), map[string]any{"acls": acls})
	if err != nil {
		t.Fatalf("failed to update user acls: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("setUserACLs returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
