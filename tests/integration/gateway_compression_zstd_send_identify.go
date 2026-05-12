/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *zstdGatewayClient) sendIdentify() {
	payload := map[string]interface{}{
		"op": gatewayOpIdentify,
		"d": map[string]interface{}{
			"token": g.token,
			"properties": map[string]interface{}{
				"os":      "integration-test",
				"browser": "integration-test",
				"device":  "integration-test",
			},
		},
	}
	g.writeJSON(payload)
}
