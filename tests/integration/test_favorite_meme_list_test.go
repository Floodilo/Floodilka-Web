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

func TestFavoriteMeme_List(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	t.Run("can list memes for authenticated user", func(t *testing.T) {
		resp, err := client.getWithAuth("/users/@me/memes", user.Token)
		if err != nil {
			t.Fatalf("failed to list memes: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var memes []favoriteMemeResponse
		decodeJSONResponse(t, resp, &memes)

		t.Logf("User has %d memes", len(memes))
	})

	t.Run("requires authentication", func(t *testing.T) {
		resp, err := client.get("/users/@me/memes")
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", resp.StatusCode)
		}
	})
}
