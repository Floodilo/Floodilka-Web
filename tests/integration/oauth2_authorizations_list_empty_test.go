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

// TestOAuth2AuthorizationsListEmpty verifies that a user with no authorized
// apps receives an empty list.
func TestOAuth2AuthorizationsListEmpty(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	resp, err := client.getWithAuth("/oauth2/@me/authorizations", user.Token)
	if err != nil {
		t.Fatalf("failed to list authorizations: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list authorizations failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var authorizations []oauth2AuthorizationResponse
	decodeJSONResponse(t, resp, &authorizations)

	if len(authorizations) != 0 {
		t.Fatalf("expected empty list, got %d authorizations", len(authorizations))
	}
}
