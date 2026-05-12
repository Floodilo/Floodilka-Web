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

func TestKlipyTrending(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	t.Run("can get trending GIFs", func(t *testing.T) {
		trendingResp := getKlipyTrending(t, client, user.Token, "")

		if len(trendingResp) == 0 {
			t.Fatal("expected trending GIFs, got none")
		}

		t.Logf("Received %d trending GIFs", len(trendingResp))
	})

	t.Run("can get trending with locale", func(t *testing.T) {
		trendingResp := getKlipyTrending(t, client, user.Token, "fr")

		if len(trendingResp) == 0 {
			t.Fatal("expected trending GIFs with locale, got none")
		}

		t.Logf("Received %d trending GIFs for locale 'fr'", len(trendingResp))
	})

	t.Run("requires authentication", func(t *testing.T) {
		resp, err := client.get("/klipy/trending-gifs")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", resp.StatusCode)
		}
	})
}
