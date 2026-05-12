/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"time"
)

func (g *zstdGatewayClient) startHeartbeat(interval time.Duration) {
	g.heartbeatMu.Lock()
	defer g.heartbeatMu.Unlock()

	if g.heartbeatTimer != nil {
		g.heartbeatTimer.Stop()
	}

	g.heartbeatTimer = time.NewTicker(interval)
	go func() {
		for {
			select {
			case <-g.heartbeatTimer.C:
				g.sendHeartbeat()
			case <-g.heartbeatDone:
				return
			}
		}
	}()
}
