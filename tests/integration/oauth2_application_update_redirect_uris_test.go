/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
	"time"
)

// TestOAuth2ApplicationUpdateRedirectURIs validates updating redirect URIs.
func TestOAuth2ApplicationUpdateRedirectURIs(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Update URIs Test %d", time.Now().UnixNano())
	originalURIs := []string{"https://example.com/callback"}

	appID, _, _ := createOAuth2BotApplication(t, client, owner, name, originalURIs)

	newURIs := []string{"https://example.com/new-callback", "https://example.com/other-callback"}
	updates := map[string]any{
		"redirect_uris": newURIs,
	}

	updated := updateOAuth2Application(t, client, owner.Token, appID, updates)

	if len(updated.RedirectURIs) != len(newURIs) {
		t.Fatalf("expected %d redirect URIs, got %d", len(newURIs), len(updated.RedirectURIs))
	}
	for i, uri := range newURIs {
		if updated.RedirectURIs[i] != uri {
			t.Fatalf("redirect_uri[%d] mismatch: expected %q, got %q", i, uri, updated.RedirectURIs[i])
		}
	}

	if updated.Name != name {
		t.Fatalf("name should remain unchanged")
	}
}
