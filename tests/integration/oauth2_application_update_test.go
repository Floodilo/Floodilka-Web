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

// TestOAuth2ApplicationUpdate validates updating an application's name.
func TestOAuth2ApplicationUpdate(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	originalName := fmt.Sprintf("Original Name %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}

	appID, _, _ := createOAuth2BotApplication(t, client, owner, originalName, redirectURIs)

	newName := fmt.Sprintf("Updated Name %d", time.Now().UnixNano())
	updates := map[string]any{
		"name": newName,
	}

	updated := updateOAuth2Application(t, client, owner.Token, appID, updates)

	if updated.Name != newName {
		t.Fatalf("expected name %q, got %q", newName, updated.Name)
	}
	if updated.ID != appID {
		t.Fatalf("application id should not change")
	}

	if len(updated.RedirectURIs) != len(redirectURIs) || updated.RedirectURIs[0] != redirectURIs[0] {
		t.Fatalf("redirect_uris should remain unchanged")
	}
}
