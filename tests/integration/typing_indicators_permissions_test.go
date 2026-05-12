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

func TestTypingIndicatorsPermissions(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	createFriendship(t, client, user1, user2)
	channel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	user3 := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/typing", parseSnowflake(t, channel.ID)), nil, user3.Token)
	if err != nil {
		t.Fatalf("failed to send typing request: %v", err)
	}
	if resp.StatusCode == http.StatusNoContent {
		t.Fatalf("expected typing to fail for user without access to channel")
	}
	resp.Body.Close()
}
