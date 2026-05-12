/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *gatewayClient) popPending() (gatewayDispatch, bool) {
	g.pendingMu.Lock()
	defer g.pendingMu.Unlock()
	if len(g.pendingDispatch) == 0 {
		return gatewayDispatch{}, false
	}
	dispatch := g.pendingDispatch[0]
	g.pendingDispatch = g.pendingDispatch[1:]
	return dispatch, true
}
