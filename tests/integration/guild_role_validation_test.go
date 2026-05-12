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

func TestGuildRoleValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	guild := createGuild(t, client, owner.Token, "Role Validation Guild")
	guildID := parseSnowflake(t, guild.ID)

	t.Run("reject updating nonexistent role", func(t *testing.T) {
		payload := map[string]any{"name": "New Name"}
		resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d/roles/999999999999999999", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("reject deleting nonexistent role", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/guilds/%d/roles/999999999999999999", guildID), owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("reject deleting @everyone role", func(t *testing.T) {
		resp, err := client.getWithAuth(fmt.Sprintf("/guilds/%d", guildID), owner.Token)
		if err != nil {
			t.Fatalf("failed to get guild: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var guildData struct {
			ID string `json:"id"`
		}
		decodeJSONResponse(t, resp, &guildData)

		resp, err = client.delete(fmt.Sprintf("/guilds/%d/roles/%s", guildID, guildData.ID), owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("accept valid role creation", func(t *testing.T) {
		payload := map[string]any{
			"name":        "Valid Role",
			"color":       0xFF5733,
			"permissions": "0",
			"hoist":       true,
			"mentionable": true,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", guildID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to create role: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var role struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		}
		decodeJSONResponse(t, resp, &role)

		if role.Name != "Valid Role" {
			t.Errorf("expected role name 'Valid Role', got '%s'", role.Name)
		}

		resp, err = client.delete(fmt.Sprintf("/guilds/%d/roles/%s", guildID, role.ID), owner.Token)
		if err != nil {
			t.Fatalf("failed to delete role: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})
}
