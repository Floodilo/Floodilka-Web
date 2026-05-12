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

// TestClientSecretResetRequiresSudo ensures rotation is rejected without sudo payload.
func TestClientSecretResetRequiresSudo(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	appID, _, _, _ := createOAuth2Application(
		t, client, owner,
		fmt.Sprintf("Client Secret Sudo %d", time.Now().UnixNano()),
		[]string{"https://example.com/callback"},
		[]string{"identify"},
	)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s/client-secret/reset", appID), map[string]any{}, owner.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("rotation should require sudo payload")
	}
	if resp.StatusCode != http.StatusUnauthorized && resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 401/403 for missing sudo, got %d", resp.StatusCode)
	}
}
