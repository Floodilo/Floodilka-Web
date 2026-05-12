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

// authenticateWithBotToken authenticates using a bot token and returns the account details.
func authenticateWithBotToken(t testing.TB, client *testClient, botToken string) testAccount {
	t.Helper()
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/@me", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build bot auth request: %v", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bot %s", botToken))
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("bot auth request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("bot auth failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var user struct {
		ID    string `json:"id"`
		Email string `json:"email"`
	}
	decodeJSONResponse(t, resp, &user)

	return testAccount{
		UserID: user.ID,
		Token:  botToken,
		Email:  user.Email,
	}
}
