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

// TestOAuth2ApplicationUpdateKeepsBot validates updating an application retains bot and hides secrets.
func TestOAuth2ApplicationUpdateKeepsBot(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	originalName := fmt.Sprintf("Conf Original %d", time.Now().UnixNano())
	originalURIs := []string{"https://example.com/callback"}

	appID, botID, _, _ := createOAuth2Application(t, client, owner, originalName, originalURIs, nil)

	newName := fmt.Sprintf("Conf Updated %d", time.Now().UnixNano())
	newURIs := []string{"https://example.com/new-callback"}

	updates := map[string]any{
		"name":          newName,
		"redirect_uris": newURIs,
	}

	updated := updateOAuth2Application(t, client, owner.Token, appID, updates)

	if updated.Name != newName {
		t.Fatalf("expected name %q, got %q", newName, updated.Name)
	}
	if len(updated.RedirectURIs) != len(newURIs) || updated.RedirectURIs[0] != newURIs[0] {
		t.Fatalf("redirect_uris not updated correctly")
	}

	if updated.Bot == nil || updated.Bot.ID != botID {
		t.Fatalf("application should retain its bot user after update")
	}
	if updated.Bot.Token != "" {
		t.Fatalf("bot token should not be returned in update response")
	}
	if updated.ClientSecret != "" {
		t.Fatalf("client_secret should not be returned in update response")
	}
}
