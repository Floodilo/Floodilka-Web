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

// TestOAuth2AuthorizationsRequiresAuth verifies that the authorizations
// endpoints require authentication.
func TestOAuth2AuthorizationsRequiresAuth(t *testing.T) {
	client := newTestClient(t)

	req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/oauth2/@me/authorizations", client.baseURL), nil)
	client.applyCommonHeaders(req)
	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	if resp.Body != nil {
		resp.Body.Close()
	}

	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401 for unauthenticated request, got %d", resp.StatusCode)
	}
}
