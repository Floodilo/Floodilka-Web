/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/url"
	"os"
	"testing"
)

func appendGatewayQuery(t testing.TB, raw string) string {
	t.Helper()
	if raw == "" {
		t.Fatalf("gateway url is empty")
	}
	parsed, err := url.Parse(raw)
	if err != nil {
		t.Fatalf("invalid gateway url %q: %v", raw, err)
	}
	if !parsed.IsAbs() {
		base := os.Getenv("FLOODILKA_INTEGRATION_API_URL")
		if base == "" {
			t.Fatalf("relative gateway url %q but FLOODILKA_INTEGRATION_API_URL not set", raw)
		}
		baseURL, err := url.Parse(base)
		if err != nil {
			t.Fatalf("invalid FLOODILKA_INTEGRATION_API_URL %q: %v", base, err)
		}
		switch baseURL.Scheme {
		case "https":
			parsed.Scheme = "wss"
		default:
			parsed.Scheme = "ws"
		}
		parsed.Host = baseURL.Host
	}
	query := parsed.Query()
	query.Set("v", "1")
	query.Set("encoding", "json")
	parsed.RawQuery = query.Encode()
	if parsed.Path == "" {
		parsed.Path = "/"
	}
	return parsed.String()
}
