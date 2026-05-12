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

// TestNonexistentResourceReturns404 tests 404 handling
func TestNonexistentResourceReturns404(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	resp, err := client.getWithAuth("/guilds/999999999999999999", user.Token)
	if err != nil {
		t.Fatalf("failed to check nonexistent guild: %v", err)
	}
	if resp.StatusCode != http.StatusNotFound && resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 404/403 for nonexistent guild, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/channels/999999999999999999", user.Token)
	if err != nil {
		t.Fatalf("failed to check nonexistent channel: %v", err)
	}
	if resp.StatusCode != http.StatusNotFound && resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 404/403 for nonexistent channel, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/999999999999999999", user.Token)
	if err != nil {
		t.Fatalf("failed to check nonexistent user: %v", err)
	}
	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for nonexistent user, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
