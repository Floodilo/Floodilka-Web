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

// TestEmptyAndNullInputHandling tests handling of empty/null values
func TestEmptyAndNullInputHandling(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Empty Input Guild %d", time.Now().UnixNano()))
	channelID := parseSnowflake(t, guild.SystemChannel)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), map[string]string{"content": ""}, owner.Token)
	if err != nil {
		t.Fatalf("failed to send empty message: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for empty message content, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuth("/guilds", map[string]string{"name": ""}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create guild with empty name: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for empty guild name, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuth("/users/@me/channels", map[string]any{"recipients": []string{}}, owner.Token)
	if err != nil {
		t.Fatalf("failed to attempt DM creation with empty recipients: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var dm minimalChannelResponse
	decodeJSONResponse(t, resp, &dm)
	if dm.ID == "" {
		t.Fatalf("expected DM response to include id")
	}

	resp, err = client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", parseSnowflake(t, guild.ID)), map[string]any{"name": "", "permissions": "0"}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create role with empty name: %v", err)
	}
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 200 (default name used) or 400 (rejected) for empty role name, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/channels/%d/messages/123456789012345678", channelID), map[string]any{"content": nil}, owner.Token)
	if err != nil {
		t.Fatalf("failed to attempt null content edit: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected editing with null content to be rejected")
	}
	resp.Body.Close()
}
