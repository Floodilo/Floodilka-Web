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
	"strings"
	"testing"
	"time"
)

// TestOversizedInputRejection tests that oversized payloads are rejected
func TestOversizedInputRejection(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Input Test Guild %d", time.Now().UnixNano()))
	channelID := parseSnowflake(t, guild.SystemChannel)

	longContent := strings.Repeat("a", 5000)
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), map[string]string{"content": longContent}, owner.Token)
	if err != nil {
		t.Fatalf("failed to send oversized message: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for oversized message content, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	longName := strings.Repeat("a", 500)
	resp, err = client.postJSONWithAuth("/guilds", map[string]string{"name": longName}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create guild with long name: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for oversized guild name, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	longBio := strings.Repeat("b", 5000)
	resp, err = client.patchJSONWithAuth("/users/@me", map[string]string{"bio": longBio}, owner.Token)
	if err != nil {
		t.Fatalf("failed to update with long bio: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 for oversized bio, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
