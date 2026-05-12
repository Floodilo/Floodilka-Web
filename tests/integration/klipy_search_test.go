/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

func TestKlipySearch(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	t.Run("can search for GIFs", func(t *testing.T) {
		searchResp := searchKlipyGIFs(t, client, user.Token, "happy", "")

		if len(searchResp) == 0 {
			t.Fatal("expected search results, got none")
		}

		t.Logf("Found %d GIFs for query 'happy'", len(searchResp))

		firstGIF := searchResp[0]
		if firstGIF.ID == "" {
			t.Fatal("GIF ID should not be empty")
		}

		t.Logf("First GIF: ID=%s, Title=%s", firstGIF.ID, firstGIF.Title)
	})

	t.Run("can search with locale", func(t *testing.T) {
		searchResp := searchKlipyGIFs(t, client, user.Token, "hello", "en-US")

		if len(searchResp) == 0 {
			t.Fatal("expected search results with locale, got none")
		}

		t.Logf("Found %d GIFs for query 'hello' with locale 'en-US'", len(searchResp))
	})

	t.Run("returns results for nonexistent query", func(t *testing.T) {
		searchResp := searchKlipyGIFs(t, client, user.Token, "xyznonexistentquery123", "")

		t.Logf("Search for nonexistent query returned %d results", len(searchResp))
	})

	t.Run("requires authentication", func(t *testing.T) {
		resp, err := client.get("/klipy/search?q=happy")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", resp.StatusCode)
		}
	})
}
