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

// revokeOAuth2Token revokes an OAuth2 token.
func revokeOAuth2Token(t testing.TB, client *testClient, clientID string, clientSecret string, token string, tokenTypeHint string) {
	t.Helper()
	if clientSecret == "" {
		clientSecret = getClientSecret(t, clientID)
	}
	form := url.Values{
		"token": {token},
	}
	if tokenTypeHint != "" {
		form.Set("token_type_hint", tokenTypeHint)
	}

	req, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s/oauth2/token/revoke", client.baseURL), strings.NewReader(form.Encode()))
	if err != nil {
		t.Fatalf("failed to build revoke request: %v", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if clientSecret != "" {
		req.SetBasicAuth(clientID, clientSecret)
	}
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("revoke request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("revoke failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
