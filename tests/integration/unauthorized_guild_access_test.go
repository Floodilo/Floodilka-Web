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

// TestUnauthorizedGuildAccess attempts to access guilds without permission
func TestUnauthorizedGuildAccess(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	attacker := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Private Guild %d", time.Now().UnixNano()))
	guildID := parseSnowflake(t, guild.ID)

	resp, err := client.getWithAuth(fmt.Sprintf("/guilds/%d", guildID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt guild access: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized guild access, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.getWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt channel list: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized channel list, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.getWithAuth(fmt.Sprintf("/guilds/%d/members", guildID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt member list: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized member list, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
