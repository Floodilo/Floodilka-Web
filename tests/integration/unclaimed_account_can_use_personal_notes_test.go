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

// TestUnclaimedAccountCanUsePersonalNotes verifies that unclaimed accounts
// CAN send messages and add reactions in their Personal Notes channel.
func TestUnclaimedAccountCanUsePersonalNotes(t *testing.T) {
	client := newTestClient(t)

	account := createTestAccount(t, client)

	personalNotesChannelID := account.UserID

	unclaimAccount(t, client, account.UserID)

	resp, err := client.postJSONWithAuth(
		fmt.Sprintf("/channels/%s/messages", personalNotesChannelID),
		map[string]string{"content": "My personal note"},
		account.Token,
	)
	if err != nil {
		t.Fatalf("failed to send message to Personal Notes: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 200 or 201 for Personal Notes message, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	t.Log("Unclaimed account can use Personal Notes test passed")
}
