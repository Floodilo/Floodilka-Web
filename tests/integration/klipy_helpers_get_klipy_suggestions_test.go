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

// getKlipySuggestions gets autocomplete suggestions from Klipy
// Returns an array of suggestion strings
func getKlipySuggestions(t testing.TB, client *testClient, token, query, locale string) []string {
	t.Helper()

	url := fmt.Sprintf("/klipy/suggest?q=%s", query)
	if locale != "" {
		url += fmt.Sprintf("&locale=%s", locale)
	}

	resp, err := client.getWithAuth(url, token)
	if err != nil {
		t.Fatalf("failed to get klipy suggestions: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var suggestions []string
	decodeJSONResponse(t, resp, &suggestions)

	return suggestions
}
