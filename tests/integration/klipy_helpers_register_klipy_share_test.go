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

// registerKlipyShare registers a GIF share with Klipy for analytics (returns 204 No Content)
func registerKlipyShare(t testing.TB, client *testClient, token, gifID string, query *string, locale string) {
	t.Helper()

	req := registerKlipyShareRequest{
		ID:     gifID,
		Q:      query,
		Locale: locale,
	}

	resp, err := client.postJSONWithAuth("/klipy/register-share", req, token)
	if err != nil {
		t.Fatalf("failed to register klipy share: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusNoContent)
}
