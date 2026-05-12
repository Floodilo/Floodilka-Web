/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *zstdGatewayClient) sendHeartbeat() {
	seq := g.sequence.Load()
	payload := map[string]interface{}{
		"op": gatewayOpHeartbeat,
		"d":  seq,
	}
	g.writeJSON(payload)
}
