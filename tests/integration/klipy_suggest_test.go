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

func TestKlipySuggest(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	t.Run("can get autocomplete suggestions", func(t *testing.T) {
		suggestResp := getKlipySuggestions(t, client, user.Token, "hap", "")

		if len(suggestResp) == 0 {
			t.Fatal("expected autocomplete suggestions, got none")
		}

		t.Logf("Received %d suggestions for query 'hap'", len(suggestResp))
	})

	t.Run("can get suggestions with locale", func(t *testing.T) {
		suggestResp := getKlipySuggestions(t, client, user.Token, "hel", "de")

		if len(suggestResp) == 0 {
			t.Fatal("expected autocomplete suggestions with locale, got none")
		}

		t.Logf("Received %d suggestions for query 'hel' with locale 'de'", len(suggestResp))
	})

	t.Run("requires authentication", func(t *testing.T) {
		resp, err := client.get("/klipy/suggest?q=hap")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", resp.StatusCode)
		}
	})
}
