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

// TestOAuth2ApplicationUpdatePartial validates that partial updates work correctly.
func TestOAuth2ApplicationUpdatePartial(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	originalName := fmt.Sprintf("Partial Original %d", time.Now().UnixNano())
	originalURIs := []string{"https://example.com/old"}

	appID, _, _ := createOAuth2BotApplication(t, client, owner, originalName, originalURIs)

	newName := fmt.Sprintf("Partial Updated %d", time.Now().UnixNano())
	updates := map[string]any{
		"name": newName,
	}

	updated := updateOAuth2Application(t, client, owner.Token, appID, updates)

	if updated.Name != newName {
		t.Fatalf("expected name %q, got %q", newName, updated.Name)
	}

	if len(updated.RedirectURIs) != len(originalURIs) || updated.RedirectURIs[0] != originalURIs[0] {
		t.Fatalf("redirect_uris should remain unchanged: expected %v, got %v", originalURIs, updated.RedirectURIs)
	}
}
