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

// Meme limit constants
const (
	MaxFavoriteMemesNonPremium = 50
	MaxFavoriteMemesPremium    = 500
)

func TestFavoriteMeme_LimitEnforcement(t *testing.T) {

	t.Run("enforces limit at boundary", func(t *testing.T) {
		client := newTestClient(t)
		user := createTestAccount(t, client)
		ensureSessionStarted(t, client, user.Token)

		for i := 0; i < MaxFavoriteMemesNonPremium; i++ {
			payload := map[string]any{
				"url":  fmt.Sprintf("https://picsum.photos/id/%d/100", i),
				"name": fmt.Sprintf("Meme %d", i),
			}

			resp, err := client.postJSONWithAuth("/users/@me/memes", payload, user.Token)
			if err != nil {
				t.Fatalf("failed to create meme %d: %v", i, err)
			}
			resp.Body.Close()

			if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
				t.Fatalf("meme %d creation failed with status %d", i, resp.StatusCode)
			}
		}

		payload := map[string]any{
			"url":  favoriteMemeTestImageURL,
			"name": "Over Limit Meme",
		}

		resp, err := client.postJSONWithAuth("/users/@me/memes", payload, user.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated {
			t.Error("expected meme creation to fail when at limit")
		}

		// Verify error response
		var errResp struct {
			Code             string `json:"code"`
			Message          string `json:"message"`
			MaxFavoriteMemes int    `json:"max_favorite_memes"`
			IsPremium        bool   `json:"is_premium"`
		}
		decodeJSONResponse(t, resp, &errResp)

		if errResp.Code != "MAX_FAVORITE_MEMES" {
			t.Errorf("expected error code MAX_FAVORITE_MEMES, got %s", errResp.Code)
		}

		if errResp.MaxFavoriteMemes != MaxFavoriteMemesNonPremium {
			t.Errorf("expected max_favorite_memes %d, got %d", MaxFavoriteMemesNonPremium, errResp.MaxFavoriteMemes)
		}

		if errResp.IsPremium {
			t.Error("expected is_premium to be false")
		}
	})
}
