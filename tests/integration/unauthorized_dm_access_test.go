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

// TestUnauthorizedDMAccess tests DM privacy
func TestUnauthorizedDMAccess(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	attacker := createTestAccount(t, client)

	guild := createGuild(t, client, user1.Token, "Test Guild")
	invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, user2.Token, invite.Code)

	dmChannel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	channelID := parseSnowflake(t, dmChannel.ID)

	message := sendChannelMessage(t, client, user1.Token, channelID, "private DM content")

	resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages?limit=10", channelID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM read: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized DM read, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	ensureSessionStarted(t, client, attacker.Token)
	resp, err = client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), map[string]string{"content": "attacker intrusion"}, attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM send: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized DM send, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	messageID := parseSnowflake(t, message.ID)
	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), map[string]string{"content": "hacked dm"}, attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM edit: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized DM edit, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
