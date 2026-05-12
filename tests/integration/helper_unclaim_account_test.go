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

// unclaimAccount uses the test harness to clear a user's email and password so they become unclaimed.
func unclaimAccount(t testing.TB, client *testClient, userID string) {
	t.Helper()

	resp, err := client.postJSON(fmt.Sprintf("/test/users/%s/unclaim", userID), nil)
	if err != nil {
		t.Fatalf("failed to unclaim account: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("unclaim returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
