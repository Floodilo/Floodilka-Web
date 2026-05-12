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

// TestGuildRoleDeleteHierarchyEnforcement ensures role deletions respect the hierarchy.
func TestGuildRoleDeleteHierarchyEnforcement(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	moderator := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Role Delete Hierarchy %d", time.Now().UnixNano()))
	guildID := parseSnowflake(t, guild.ID)
	channelID := parseSnowflake(t, guild.SystemChannel)
	invite := createChannelInvite(t, client, owner.Token, channelID)
	joinGuild(t, client, moderator.Token, invite.Code)

	createRole := func(name string, permissions string) string {
		payload := map[string]any{
			"name":        name,
			"permissions": permissions,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to create role %s: %v", name, err)
		}
		assertStatus(t, resp, http.StatusOK)
		var role struct {
			ID string `json:"id"`
		}
		decodeJSONResponse(t, resp, &role)
		resp.Body.Close()
		return role.ID
	}

	adminRole := createRole("Admin Role", "0")
	modRole := createRole("Moderator Role", "268435456")

	resp, err := client.patchJSONWithAuth(
		fmt.Sprintf("/guilds/%d/roles", guildID),
		[]map[string]any{
			{"id": adminRole, "position": 100},
			{"id": modRole, "position": 50},
		},
		owner.Token,
	)
	if err != nil {
		t.Fatalf("failed to reorder roles: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.patchJSONWithAuth(
		fmt.Sprintf("/guilds/%d/members/%s", guildID, moderator.UserID),
		map[string]any{"roles": []string{modRole}},
		owner.Token,
	)
	if err != nil {
		t.Fatalf("failed to assign moderator role: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/guilds/%d/roles/%s", guildID, adminRole), moderator.Token)
	if err != nil {
		t.Fatalf("delete request failed: %v", err)
	}
	assertStatus(t, resp, http.StatusForbidden)
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/guilds/%d/roles/%s", guildID, adminRole), owner.Token)
	if err != nil {
		t.Fatalf("owner delete request failed: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()
}
