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

// resetBotToken resets the bot token for an OAuth2 application.
func resetBotToken(t testing.TB, client *testClient, owner testAccount, applicationID string) string {
	t.Helper()
	payload := map[string]any{
		"password": owner.Password,
	}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s/bot/reset-token", applicationID), payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to reset bot token: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("reset bot token failed: %s", readResponseBody(resp))
	}
	var result struct {
		Token string `json:"token"`
	}
	decodeJSONResponse(t, resp, &result)
	if result.Token == "" {
		t.Fatalf("reset bot token response missing token")
	}
	return result.Token
}
