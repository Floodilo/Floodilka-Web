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

// getOAuth2UserInfo retrieves user information using an OAuth2 access token.
func getOAuth2UserInfo(t testing.TB, client *testClient, accessToken string) map[string]any {
	t.Helper()
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/oauth2/userinfo", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build userinfo request: %v", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("userinfo request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("userinfo request failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var userInfo map[string]any
	decodeJSONResponse(t, resp, &userInfo)
	return userInfo
}
