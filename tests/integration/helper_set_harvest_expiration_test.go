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

type setHarvestExpirationPayload struct {
	ExpiresAt string `json:"expires_at"`
}

func setHarvestExpiration(t testing.TB, client *testClient, userID string, harvestID string, expiresAt string) {
	t.Helper()
	payload := setHarvestExpirationPayload{
		ExpiresAt: expiresAt,
	}
	resp, err := client.postJSON(fmt.Sprintf("/test/users/%s/harvest/%s/set-expiration", userID, harvestID), payload)
	if err != nil {
		t.Fatalf("failed to set harvest expiration: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()
}
