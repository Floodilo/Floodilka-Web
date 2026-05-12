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

func TestKlipyRegisterShare(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	t.Run("can register GIF share", func(t *testing.T) {
		searchResp := searchKlipyGIFs(t, client, user.Token, "happy", "")

		if len(searchResp) == 0 {
			t.Skip("no GIFs found to test share registration")
		}

		gifID := searchResp[0].ID
		query := "happy"

		registerKlipyShare(t, client, user.Token, gifID, &query, "")

		t.Logf("Successfully registered share for GIF ID: %s", gifID)
	})

	t.Run("requires authentication", func(t *testing.T) {
		query := "test"
		req := registerKlipyShareRequest{
			ID:     "test_id",
			Q:      &query,
			Locale: "",
		}

		resp, err := client.postJSON("/klipy/register-share", req)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", resp.StatusCode)
		}
	})
}
