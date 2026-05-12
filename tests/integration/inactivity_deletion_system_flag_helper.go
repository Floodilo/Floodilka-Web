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

// setSystemFlag sets or clears the system flag for a user
func setSystemFlag(t testing.TB, client *testClient, userID string, isSystem bool) {
	t.Helper()

	payload := map[string]any{
		"is_system": isSystem,
	}

	resp, err := client.postJSON(
		fmt.Sprintf("/test/users/%s/set-system-flag", userID),
		payload,
	)
	if err != nil {
		t.Fatalf("failed to set system flag: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 when setting system flag, got %d", resp.StatusCode)
	}
}
