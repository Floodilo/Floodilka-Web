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

// TestOAuth2ApplicationGet validates retrieving a single application's details.
func TestOAuth2ApplicationGet(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Get Test App %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}
	scopes := []string{"identify", "email", "guilds"}

	appID, _, _, _ := createOAuth2Application(t, client, owner, name, redirectURIs, scopes)

	app := getOAuth2Application(t, client, owner.Token, appID)

	if app.ID != appID {
		t.Fatalf("expected id %s, got %s", appID, app.ID)
	}
	if app.Name != name {
		t.Fatalf("expected name %q, got %q", name, app.Name)
	}
	if len(app.RedirectURIs) != len(redirectURIs) || app.RedirectURIs[0] != redirectURIs[0] {
		t.Fatalf("expected redirect_uris %v, got %v", redirectURIs, app.RedirectURIs)
	}
	if app.RedirectURIs == nil {
		t.Fatalf("expected redirect_uris to be present")
	}

	if app.Bot == nil {
		t.Fatalf("expected bot object in response")
	}
	if app.Bot.ID == "" {
		t.Fatalf("bot response missing id")
	}
	if app.Bot.Username == "" {
		t.Fatalf("bot response missing username")
	}
	if app.Bot.Discriminator == "" {
		t.Fatalf("bot response missing discriminator")
	}

	if app.Bot.Token != "" {
		t.Fatalf("bot token should not be returned in GET requests for security")
	}

	if app.ClientSecret != "" {
		t.Fatalf("client_secret should not be returned in GET requests")
	}
}
