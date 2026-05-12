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

func featureFlagAdminToken(t testing.TB, client *testClient, extraACLs []string) string {
	t.Helper()

	admin := createTestAccount(t, client)
	acls := append([]string{"admin:authenticate"}, extraACLs...)
	setUserACLs(t, client, admin.UserID, acls)

	redirectURI := "https://example.com/callback"
	appID, _, _, _ := createOAuth2Application(
		t,
		client,
		admin,
		fmt.Sprintf("Feature Flags Admin %d", time.Now().UnixNano()),
		[]string{redirectURI},
		nil,
	)

	authCode, _ := authorizeOAuth2(t, client, admin.Token, appID, redirectURI, []string{"identify"}, "", "", "")
	token := exchangeOAuth2AuthorizationCode(t, client, appID, "", authCode, redirectURI, "").AccessToken
	return token
}

func updateFeatureFlagGuilds(t testing.TB, client *testClient, adminToken string, flag string, guildIDs []string) {
	t.Helper()

	payload := map[string]any{
		"flag":      flag,
		"guild_ids": strings.Join(guildIDs, ","),
	}

	resp, err := client.postJSONWithAuth("/admin/feature-flags/update", payload, adminToken)
	if err != nil {
		t.Fatalf("failed to update feature flag %s: %v", flag, err)
	}
	assertStatus(t, resp, http.StatusOK)
}
