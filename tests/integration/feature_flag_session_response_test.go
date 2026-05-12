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

func TestRpcSessionIncludesFeatureFlags(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, "rpc-feature-flags")

	adminToken := featureFlagAdminToken(t, client, []string{"feature_flag:manage"})
	updateFeatureFlagGuilds(t, client, adminToken, "message_scheduling", []string{guild.ID})

	payload := map[string]any{
		"type":    "session",
		"token":   owner.Token,
		"version": 1,
	}

	resp, err := client.requestJSON(http.MethodPost, "/_rpc", payload, "Bearer test-rpc-secret")
	if err != nil {
		t.Fatalf("RPC request failed: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var body struct {
		Type string `json:"type"`
		Data struct {
			FeatureFlags map[string][]string `json:"feature_flags"`
		} `json:"data"`
	}
	decodeJSONResponse(t, resp, &body)

	if body.Type != "session" {
		t.Fatalf("expected session response, got %s", body.Type)
	}

	ids := body.Data.FeatureFlags["message_scheduling"]
	if len(ids) == 0 || ids[0] != guild.ID {
		t.Fatalf("expected guild %s in RPC feature flags, got %+v", guild.ID, ids)
	}
}
