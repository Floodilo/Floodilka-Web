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

func fetchHarvestStatus(t testing.TB, client *testClient, token, harvestID string) harvestStatusResponse {
	t.Helper()
	resp, err := client.getWithAuth(fmt.Sprintf("/users/@me/harvest/%s", harvestID), token)
	if err != nil {
		t.Fatalf("failed to fetch harvest status: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var status harvestStatusResponse
	decodeJSONResponse(t, resp, &status)
	return status
}
