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
)

func resolveWebAuthnOrigin() (string, string) {
	origin := os.Getenv("FLOODILKA_WEBAPP_ORIGIN")
	if origin == "" {
		origin = "http://localhost:8088"
	}
	parsed, err := url.Parse(origin)
	if err != nil || parsed.Host == "" {
		return "localhost:8088", "http://localhost:8088"
	}
	return parsed.Host, parsed.String()
}
