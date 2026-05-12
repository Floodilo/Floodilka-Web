/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

func (g *zstdGatewayClient) Close() {
	if g.closed.Swap(true) {
		return
	}

	g.heartbeatMu.Lock()
	if g.heartbeatTimer != nil {
		g.heartbeatTimer.Stop()
	}
	close(g.heartbeatDone)
	g.heartbeatMu.Unlock()

	if g.conn != nil {
		g.conn.Close()
	}

	if g.zstdDecoder != nil {
		g.zstdDecoder.Close()
	}

	g.wg.Wait()
}
