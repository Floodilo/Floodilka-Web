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

// setBotFlag sets or clears the bot flag for a user
func setBotFlag(t testing.TB, client *testClient, userID string, isBot bool) {
	t.Helper()

	payload := map[string]any{
		"is_bot": isBot,
	}

	resp, err := client.postJSON(
		fmt.Sprintf("/test/users/%s/set-bot-flag", userID),
		payload,
	)
	if err != nil {
		t.Fatalf("failed to set bot flag: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 when setting bot flag, got %d", resp.StatusCode)
	}
}
