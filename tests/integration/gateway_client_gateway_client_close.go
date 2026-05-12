/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"time"

	"github.com/gorilla/websocket"
)

func (g *gatewayClient) Close() {
	if !g.closed.CompareAndSwap(false, true) {
		return
	}
	g.stopHeartbeat()
	if g.conn != nil {
		_ = g.conn.SetWriteDeadline(time.Now().Add(5 * time.Second))
		_ = g.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "tests complete"))
		g.conn.Close()
	}
	g.wg.Wait()
}
