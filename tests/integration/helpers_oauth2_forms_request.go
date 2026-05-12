/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"net/url"
	"strings"
	"testing"
)

// newFormRequest creates a new HTTP request with form-encoded data.
func newFormRequest(t testing.TB, client *testClient, path string, form url.Values) *http.Request {
	t.Helper()
	req, err := http.NewRequest(http.MethodPost, client.baseURL+path, strings.NewReader(form.Encode()))
	if err != nil {
		t.Fatalf("failed to build form request: %v", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client.applyCommonHeaders(req)
	return req
}
