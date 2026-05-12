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

func TestFeatureFlagAdminGet(t *testing.T) {
	client := newTestClient(t)

	t.Run("success", func(t *testing.T) {
		token := featureFlagAdminToken(t, client, []string{"feature_flag:view"})
		resp, err := client.postJSONWithAuth("/admin/feature-flags/get", map[string]any{}, token)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		var body struct {
			FeatureFlags map[string][]string `json:"feature_flags"`
		}
		decodeJSONResponse(t, resp, &body)
		if body.FeatureFlags == nil {
			t.Fatalf("expected feature_flags in response")
		}
	})

	t.Run("unauthorized", func(t *testing.T) {
		resp, err := client.postJSON("/admin/feature-flags/get", map[string]any{})
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusUnauthorized)
	})

	t.Run("missing-acl", func(t *testing.T) {
		token := featureFlagAdminToken(t, client, nil)
		resp, err := client.postJSONWithAuth("/admin/feature-flags/get", map[string]any{}, token)
		if err != nil {
			t.Fatalf("request failed: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusForbidden)
	})
}
