/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
)

func (g *zstdGatewayClient) handlePayload(payload gatewayPayload) {
	switch payload.Op {
	case gatewayOpHello:
		var hello gatewayHelloPayload
		if err := json.Unmarshal(payload.Data, &hello); err == nil {
			select {
			case g.helloCh <- hello:
			default:
			}
		}
	case gatewayOpHeartbeatAck:
	case gatewayOpDispatch:
		seq := int64(0)
		if payload.Sequence != nil {
			seq = int64(*payload.Sequence)
		}
		g.sequence.Store(seq)
		dispatch := gatewayDispatch{
			Type:     payload.Type,
			Data:     payload.Data,
			Sequence: seq,
		}

		switch payload.Type {
		case "READY":
			g.pendingMu.Lock()
			g.pendingDispatch = append(g.pendingDispatch, dispatch)
			g.pendingMu.Unlock()
			close(g.readySignal)
		case "RESUMED":
			close(g.resumedSignal)
		default:
			select {
			case g.dispatchCh <- dispatch:
			default:
				g.pendingMu.Lock()
				g.pendingDispatch = append(g.pendingDispatch, dispatch)
				g.pendingMu.Unlock()
			}
		}
	}
}
