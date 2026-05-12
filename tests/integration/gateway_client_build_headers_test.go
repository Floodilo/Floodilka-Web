/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"os"
	"testing"
)

func buildHeaders(t testing.TB, client *testClient) http.Header {
	t.Helper()
	headers := http.Header{}
	headers.Set("User-Agent", "FloodilkaIntegrationTests/1.0")
	if origin := os.Getenv("FLOODILKA_WEBAPP_ORIGIN"); origin != "" {
		headers.Set("Origin", origin)
	}
	if client != nil && client.clientIP != "" {
		headers.Set("X-Forwarded-For", client.clientIP)
	}
	if testToken := os.Getenv("FLOODILKA_TEST_TOKEN"); testToken != "" {
		headers.Set("X-Test-Token", testToken)
	}
	return headers
}
