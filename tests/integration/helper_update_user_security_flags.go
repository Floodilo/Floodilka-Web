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

func updateUserSecurityFlags(t testing.TB, client *testClient, userID string, payload userSecurityFlagsPayload) {
	t.Helper()
	resp, err := client.postJSON(fmt.Sprintf("/test/users/%s/security-flags", userID), payload)
	if err != nil {
		t.Fatalf("failed to update user security flags: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()
}
