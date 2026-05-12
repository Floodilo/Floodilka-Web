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

func TestExpressionPackFeatureFlagGating(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)
	grantPremium(t, client, owner.UserID, PremiumTypeSubscription)
	guild := createGuild(t, client, owner.Token, "packs-flag")

	adminToken := featureFlagAdminToken(t, client, []string{"feature_flag:manage", "user:update:flags"})

	resp, err := client.postJSONWithAuth("/packs/emoji", map[string]any{"name": "feature-flag-pack"}, owner.Token)
	if err != nil {
		t.Fatalf("failed to call create pack endpoint: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusForbidden)

	updateFeatureFlagGuilds(t, client, adminToken, "expression_packs", []string{guild.ID})

	resp, err = client.postJSONWithAuth("/packs/emoji", map[string]any{"name": "feature-flag-pack"}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create pack after enabling flag: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
}
