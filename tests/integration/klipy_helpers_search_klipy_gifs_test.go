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

// searchKlipyGIFs searches for GIFs using the Klipy API
// Returns an array of GIF results
func searchKlipyGIFs(t testing.TB, client *testClient, token, query, locale string) []klipyGIF {
	t.Helper()

	url := fmt.Sprintf("/klipy/search?q=%s", query)
	if locale != "" {
		url += fmt.Sprintf("&locale=%s", locale)
	}

	resp, err := client.getWithAuth(url, token)
	if err != nil {
		t.Fatalf("failed to search klipy GIFs: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var gifs []klipyGIF
	decodeJSONResponse(t, resp, &gifs)

	return gifs
}
