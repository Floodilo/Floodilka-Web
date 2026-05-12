/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *gatewayClient) stopHeartbeat() {
	g.heartbeatMu.Lock()
	defer g.heartbeatMu.Unlock()
	if g.heartbeatTimer != nil {
		g.heartbeatTimer.Stop()
	}
	if g.heartbeatDone != nil {
		close(g.heartbeatDone)
	}
	g.heartbeatTimer = nil
	g.heartbeatDone = nil
}
