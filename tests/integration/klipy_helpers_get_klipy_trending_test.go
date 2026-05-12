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

// getKlipyTrending gets trending GIFs from Klipy
// Returns an array of GIF results
func getKlipyTrending(t testing.TB, client *testClient, token, locale string) []klipyGIF {
	t.Helper()

	url := "/klipy/trending-gifs"
	if locale != "" {
		url += fmt.Sprintf("?locale=%s", locale)
	}

	resp, err := client.getWithAuth(url, token)
	if err != nil {
		t.Fatalf("failed to get klipy trending: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var trending []klipyGIF
	decodeJSONResponse(t, resp, &trending)

	return trending
}
