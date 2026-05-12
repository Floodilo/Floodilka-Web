/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

func TestFeatureFlagAdminUpdate(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, "feature-flag-update")

	t.Run("success", func(t *testing.T) {
		adminToken := featureFlagAdminToken(t, client, []string{"feature_flag:manage"})
		payload := map[string]any{
			"flag":      "message_scheduling",
			"guild_ids": guild.ID,
		}
		resp, err := client.postJSONWithAuth("/admin/feature-flags/update", payload, adminToken)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var body struct {
			FeatureFlags map[string][]string `json:"feature_flags"`
		}
		decodeJSONResponse(t, resp, &body)
		ids := body.FeatureFlags["message_scheduling"]
		if len(ids) == 0 || ids[0] != guild.ID {
			t.Fatalf("expected guild %s in response, got %+v", guild.ID, ids)
		}
	})

	t.Run("unauthorized", func(t *testing.T) {
		resp, err := client.postJSON("/admin/feature-flags/update", map[string]any{"flag": "expression_packs", "guild_ids": ""})
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusUnauthorized)
	})

	t.Run("missing-acl", func(t *testing.T) {
		token := featureFlagAdminToken(t, client, nil)
		resp, err := client.postJSONWithAuth("/admin/feature-flags/update", map[string]any{"flag": "expression_packs", "guild_ids": guild.ID}, token)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusForbidden)
	})
}
