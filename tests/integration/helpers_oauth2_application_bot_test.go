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
)

// updateBotProfile updates the bot profile for an OAuth2 application.
func updateBotProfile(t testing.TB, client *testClient, token string, applicationID string, updates map[string]any) map[string]any {
	t.Helper()
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s/bot", applicationID), updates, token)
	if err != nil {
		t.Fatalf("failed to update bot profile: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("update bot profile failed: %s", readResponseBody(resp))
	}
	var result map[string]any
	decodeJSONResponse(t, resp, &result)
	return result
}
