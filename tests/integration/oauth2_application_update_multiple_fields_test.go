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

// TestOAuth2ApplicationUpdateMultipleFields validates updating multiple fields at once.
func TestOAuth2ApplicationUpdateMultipleFields(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	originalName := fmt.Sprintf("Original %d", time.Now().UnixNano())
	originalURIs := []string{"https://example.com/old"}

	appID, _, _ := createOAuth2BotApplication(t, client, owner, originalName, originalURIs)

	newName := fmt.Sprintf("New Name %d", time.Now().UnixNano())
	newURIs := []string{"https://example.com/new1", "https://example.com/new2"}

	updates := map[string]any{
		"name":          newName,
		"redirect_uris": newURIs,
	}

	updated := updateOAuth2Application(t, client, owner.Token, appID, updates)

	if updated.Name != newName {
		t.Fatalf("expected name %q, got %q", newName, updated.Name)
	}
	if len(updated.RedirectURIs) != len(newURIs) {
		t.Fatalf("expected %d redirect URIs, got %d", len(newURIs), len(updated.RedirectURIs))
	}
}
