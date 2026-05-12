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

// TestOAuth2MeRejectsInvalidToken ensures /oauth2/@me requires a valid bearer token.
func TestOAuth2MeRejectsInvalidToken(t *testing.T) {
	t.Parallel()

	client := newTestClient(t)

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/oauth2/@me", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build /oauth2/@me request: %v", err)
	}
	req.Header.Set("Authorization", "Bearer invalid-token-123")
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("oauth2/@me request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected /oauth2/@me to reject invalid tokens")
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401 Unauthorized for invalid token, got %d", resp.StatusCode)
	}
}
