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

func TestFavoriteMeme_Delete(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	t.Run("returns 404 for nonexistent meme", func(t *testing.T) {
		resp, err := client.delete("/users/@me/memes/999999999999999999", user.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusNotFound && resp.StatusCode != http.StatusNoContent {
			t.Errorf("expected 404 or 204 for nonexistent meme, got %d", resp.StatusCode)
		}
	})

	t.Run("requires authentication", func(t *testing.T) {
		resp, err := client.delete("/users/@me/memes/123456789", "")
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", resp.StatusCode)
		}
	})
}
