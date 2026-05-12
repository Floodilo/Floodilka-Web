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

// TestCrossGuildRoleAssignmentForbidden ensures roles cannot be applied across guild boundaries
func TestCrossGuildRoleAssignmentForbidden(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	member := createTestAccount(t, client)

	guildA := createGuild(t, client, owner.Token, "Role Source Guild")
	guildAID := parseSnowflake(t, guildA.ID)

	guildB := createGuild(t, client, owner.Token, "Role Target Guild")
	guildBID := parseSnowflake(t, guildB.ID)
	channelB := parseSnowflake(t, guildB.SystemChannel)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", guildAID), map[string]any{"name": "foreign-role"}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create role in guild A: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var role struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &role)
	roleID := role.ID

	inviteB := createChannelInvite(t, client, owner.Token, channelB)
	resp, err = client.postJSONWithAuth(fmt.Sprintf("/invites/%s", inviteB.Code), nil, member.Token)
	if err != nil {
		t.Fatalf("failed to join guild B: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.putWithAuth(fmt.Sprintf("/guilds/%d/members/%s/roles/%s", guildBID, member.UserID, roleID), owner.Token)
	if err != nil {
		t.Fatalf("failed to attempt cross-guild role add: %v", err)
	}
	if resp.StatusCode == http.StatusNoContent {
		t.Fatalf("expected cross-guild role assignment to be rejected, got 204")
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", guildBID), map[string]any{"name": "local-role"}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create local role: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var localRole struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &localRole)

	resp, err = client.putWithAuth(fmt.Sprintf("/guilds/%d/members/%s/roles/%s", guildBID, member.UserID, localRole.ID), owner.Token)
	if err != nil {
		t.Fatalf("failed to add local role: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/guilds/%d/members/%s/roles/%s", guildBID, member.UserID, roleID), owner.Token)
	if err != nil {
		t.Fatalf("failed to attempt cross-guild role removal: %v", err)
	}
	if resp.StatusCode == http.StatusNoContent {
		t.Fatalf("expected cross-guild role removal to be rejected, got 204")
	}
	resp.Body.Close()
}
