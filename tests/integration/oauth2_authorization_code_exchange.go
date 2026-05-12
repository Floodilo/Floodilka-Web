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
	"net/url"
	"strings"
	"testing"
)

// exchangeOAuth2AuthorizationCode exchanges an authorization code for an access token.
func exchangeOAuth2AuthorizationCode(t testing.TB, client *testClient, clientID string, clientSecret string, code string, redirectURI string, codeVerifier string) oauth2TokenResponse {
	t.Helper()
	_ = codeVerifier
	if clientSecret == "" {
		clientSecret = getClientSecret(t, clientID)
	}
	form := url.Values{
		"grant_type":   {"authorization_code"},
		"code":         {code},
		"redirect_uri": {redirectURI},
	}
	var resp *http.Response
	var err error

	form.Set("client_id", clientID)
	req, reqErr := http.NewRequest(http.MethodPost, fmt.Sprintf("%s/oauth2/token", client.baseURL), strings.NewReader(form.Encode()))
	if reqErr != nil {
		t.Fatalf("failed to build token request: %v", reqErr)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(clientID, clientSecret)
	client.applyCommonHeaders(req)
	resp, err = client.httpClient.Do(req)

	if err != nil {
		t.Fatalf("failed to exchange oauth2 code: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("oauth2 token exchange failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var token oauth2TokenResponse
	decodeJSONResponse(t, resp, &token)
	if token.AccessToken == "" {
		t.Fatalf("oauth2 token response missing access_token")
	}
	return token
}
