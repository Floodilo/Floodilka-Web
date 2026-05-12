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

// TestUnauthorizedChannelMessageAccess tests message access controls
func TestUnauthorizedChannelMessageAccess(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	attacker := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Message Security Guild %d", time.Now().UnixNano()))
	channelID := parseSnowflake(t, guild.SystemChannel)

	message := sendChannelMessage(t, client, owner.Token, channelID, "secret message")
	messageID := parseSnowflake(t, message.ID)

	resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages?limit=10", channelID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt message read: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized message read, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	ensureSessionStarted(t, client, attacker.Token)
	resp, err = client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), map[string]string{"content": "attacker message"}, attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt message send: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized message send, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), map[string]string{"content": "hacked"}, attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt message edit: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized message edit, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/channels/%d/messages/%d", channelID, messageID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt message delete: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized message delete, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
