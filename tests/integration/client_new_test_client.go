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
	"strings"
	"testing"
	"time"
)

func newTestClient(t testing.TB) *testClient {
	t.Helper()

	base := os.Getenv("FLOODILKA_INTEGRATION_API_URL")
	if base == "" {
		t.Skip("FLOODILKA_INTEGRATION_API_URL is not set; skipping integration tests")
	}

	return &testClient{
		baseURL:    strings.TrimSuffix(base, "/"),
		httpClient: &http.Client{Timeout: 60 * time.Second},
		clientIP:   pickTestClientIP(),
	}
}
