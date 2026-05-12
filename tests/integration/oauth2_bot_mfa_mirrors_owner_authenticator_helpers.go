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

func fetchUserMeWithToken(t testing.TB, client *testClient, token string, isBot bool) userMeResponse {
	t.Helper()
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/@me", client.baseURL), nil)
	if err != nil {
		t.Fatalf("failed to build users/@me request: %v", err)
	}
	if isBot {
		req.Header.Set("Authorization", fmt.Sprintf("Bot %s", token))
	} else {
		req.Header.Set("Authorization", token)
	}
	client.applyCommonHeaders(req)

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("users/@me request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("users/@me returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var body userMeResponse
	decodeJSONResponse(t, resp, &body)
	return body
}
