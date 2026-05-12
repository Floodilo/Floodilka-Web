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

func (g *gatewayClient) startHeartbeat(interval time.Duration) {
	g.stopHeartbeat()
	if interval <= 0 {
		return
	}
	g.heartbeatMu.Lock()
	defer g.heartbeatMu.Unlock()
	g.heartbeatTimer = time.NewTicker(interval)
	g.heartbeatDone = make(chan struct{})

	go func(timer *time.Ticker, done chan struct{}) {
		for {
			select {
			case <-timer.C:
				g.sendHeartbeat()
			case <-done:
				return
			}
		}
	}(g.heartbeatTimer, g.heartbeatDone)
}
