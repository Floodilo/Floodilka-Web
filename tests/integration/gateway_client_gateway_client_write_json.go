/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"time"
)

func (g *gatewayClient) writeJSON(body any) {
	g.writeMu.Lock()
	defer g.writeMu.Unlock()
	_ = g.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	if err := g.conn.WriteJSON(body); err != nil && !g.closed.Load() {
		g.reportError(fmt.Errorf("failed to send gateway payload: %w", err))
	}
}
