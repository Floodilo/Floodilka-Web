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

// getKlipyFeatured gets featured GIFs from Klipy
// The actual response structure depends on the Klipy API, returning as-is
func getKlipyFeatured(t testing.TB, client *testClient, token, locale string) map[string]any {
	t.Helper()

	url := "/klipy/featured"
	if locale != "" {
		url += fmt.Sprintf("?locale=%s", locale)
	}

	resp, err := client.getWithAuth(url, token)
	if err != nil {
		t.Fatalf("failed to get klipy featured: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var featured map[string]any
	decodeJSONResponse(t, resp, &featured)

	return featured
}
