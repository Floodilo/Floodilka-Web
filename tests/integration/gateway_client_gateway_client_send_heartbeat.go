/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *gatewayClient) sendHeartbeat() {
	payload := map[string]any{
		"op": gatewayOpHeartbeat,
		"d":  g.sequence.Load(),
	}
	g.writeJSON(payload)
}
