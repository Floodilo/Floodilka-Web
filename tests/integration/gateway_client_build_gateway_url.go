/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"os"
	"strings"
	"testing"
)

func buildGatewayURL(t testing.TB) string {
	t.Helper()
	if raw := strings.TrimSpace(os.Getenv("FLOODILKA_INTEGRATION_GATEWAY_URL")); raw != "" {
		return raw
	}
	if raw := strings.TrimSpace(os.Getenv("FLOODILKA_GATEWAY_ENDPOINT")); raw != "" {
		return raw
	}
	return "ws://localhost:8080"
}
