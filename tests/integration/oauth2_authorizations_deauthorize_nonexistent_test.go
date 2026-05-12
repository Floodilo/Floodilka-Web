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

// TestOAuth2AuthorizationsDeauthorizeNonexistent verifies that deauthorizing
// a non-existent application returns an appropriate error.
func TestOAuth2AuthorizationsDeauthorizeNonexistent(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	resp, err := client.delete("/oauth2/@me/authorizations/123456789012345678", user.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}

	if resp.StatusCode == http.StatusNoContent || resp.StatusCode == http.StatusOK {
		t.Fatal("expected error for non-existent application")
	}
}
