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
	"time"
)

// TestOAuth2ApplicationCreateWithoutOptionalFields validates that applications can be created
// with minimal required fields.
func TestOAuth2ApplicationCreateWithoutOptionalFields(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Minimal App %d", time.Now().UnixNano())
	payload := map[string]any{
		"name": name,
	}

	resp, err := client.postJSONWithAuth("/oauth2/applications", payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to create application: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var app oauth2ApplicationResponse
	decodeJSONResponse(t, resp, &app)

	if app.ID == "" {
		t.Fatalf("application response missing id")
	}
	if app.Name != name {
		t.Fatalf("expected name %q, got %q", name, app.Name)
	}

	if app.RedirectURIs == nil {
		t.Fatalf("redirect_uris should be an empty array, not nil")
	}

	if app.Bot == nil {
		t.Fatalf("application should have a bot user by default")
	}
}
