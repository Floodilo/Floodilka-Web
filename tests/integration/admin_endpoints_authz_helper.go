/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"strings"
	"testing"
)

func doAdminRequest(t testing.TB, client *testClient, method, path, token string) *http.Response {
	t.Helper()

	var body *strings.Reader
	if method == http.MethodGet {
		body = strings.NewReader("")
	} else {
		body = strings.NewReader("{}")
	}

	req, err := http.NewRequest(method, client.baseURL+path, body)
	if err != nil {
		t.Fatalf("failed to build request: %v", err)
	}

	if method != http.MethodGet {
		req.Header.Set("Content-Type", "application/json")
	}
	client.applyCommonHeaders(req)
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := client.httpClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	return resp
}
