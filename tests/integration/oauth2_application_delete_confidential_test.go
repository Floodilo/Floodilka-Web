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

// TestOAuth2ApplicationDeleteConfidential validates deleting an application invalidates tokens.
func TestOAuth2ApplicationDeleteConfidential(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Delete Conf %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}
	scopes := []string{"identify"}

	appID, _, _, clientSecret := createOAuth2Application(t, client, owner, name, redirectURIs, scopes)

	user := createTestAccount(t, client)
	code, _ := authorizeOAuth2(t, client, user.Token, appID, redirectURIs[0], scopes, "", "", "")
	token := exchangeOAuth2AuthorizationCode(t, client, appID, clientSecret, code, redirectURIs[0], "")

	userInfo := getOAuth2UserInfo(t, client, token.AccessToken)
	if userInfo["sub"] == nil {
		t.Fatalf("token should work before deletion")
	}

	deleteOAuth2Application(t, client, owner, appID)

	resp, err := client.getWithAuth(fmt.Sprintf("/oauth2/applications/%s", appID), owner.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("deleted application should return 404, got %d", resp.StatusCode)
	}

	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/oauth2/userinfo", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build userinfo request: %v", err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token.AccessToken))
	client.applyCommonHeaders(req)

	tokenResp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("userinfo request failed: %v", err)
	}
	tokenResp.Body.Close()

	if tokenResp.StatusCode == http.StatusOK {
		t.Fatalf("tokens should be invalidated after application deletion")
	}
}
