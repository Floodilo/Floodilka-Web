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

func TestKlipyFeatured(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	t.Run("can get featured GIFs", func(t *testing.T) {
		featuredResp := getKlipyFeatured(t, client, user.Token, "")

		if featuredResp == nil {
			t.Fatal("expected featured response, got nil")
		}

		t.Logf("Received featured response")
	})

	t.Run("can get featured with locale", func(t *testing.T) {
		featuredResp := getKlipyFeatured(t, client, user.Token, "es-ES")

		if featuredResp == nil {
			t.Fatal("expected featured response with locale, got nil")
		}

		t.Logf("Received featured response for locale 'es-ES'")
	})

	t.Run("requires authentication", func(t *testing.T) {
		resp, err := client.get("/klipy/featured")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", resp.StatusCode)
		}
	})
}
