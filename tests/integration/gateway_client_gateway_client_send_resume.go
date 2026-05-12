/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *gatewayClient) sendResume(sessionID string, seq int64) {
	payload := map[string]any{
		"op": gatewayOpResume,
		"d": map[string]any{
			"token":      g.token,
			"session_id": sessionID,
			"seq":        seq,
		},
	}
	g.writeJSON(payload)
}
