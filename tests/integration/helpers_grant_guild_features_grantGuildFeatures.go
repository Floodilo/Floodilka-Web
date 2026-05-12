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

// grantGuildFeatures adds features to a guild via the test harness.
func grantGuildFeatures(t testing.TB, client *testClient, guildID string, features []string) {
	t.Helper()
	payload := map[string]any{
		"add_features": features,
	}
	resp, err := client.postJSON(fmt.Sprintf("/test/guilds/%s/features", guildID), payload)
	if err != nil {
		t.Fatalf("failed to grant guild features: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
}
