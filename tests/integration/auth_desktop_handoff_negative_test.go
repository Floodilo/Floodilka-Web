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

// Covers error paths for desktop handoff: unknown code and mismatched token.
func TestAuthDesktopHandoffNegativePaths(t *testing.T) {
	client := newTestClient(t)

	resp, err := client.get("/auth/handoff/unknown-code/status")
	if err != nil {
		t.Fatalf("failed to call handoff status: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected unknown handoff code to fail")
	}
	resp.Body.Close()

	resp, err = client.postJSON("/auth/handoff/complete", map[string]string{
		"code":    "bad-code",
		"token":   "bad-token",
		"user_id": "123",
	})
	if err != nil {
		t.Fatalf("failed to call handoff complete: %v", err)
	}
	if resp.StatusCode == http.StatusNoContent || resp.StatusCode == http.StatusOK {
		t.Fatalf("expected handoff complete with bad code/token to fail, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.delete("/auth/handoff/unknown-code", "")
	if err != nil {
		t.Fatalf("failed to call handoff cancel: %v", err)
	}
	if resp.StatusCode >= 500 {
		t.Fatalf("expected cancel unknown code not to 5xx, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
