/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

func (g *gatewayClient) readLoop() {
	defer g.wg.Done()
	defer g.stopHeartbeat()
	defer close(g.dispatchCh)

	for {
		if g.closed.Load() {
			return
		}
		_ = g.conn.SetReadDeadline(time.Now().Add(90 * time.Second))
		_, payload, err := g.conn.ReadMessage()
		if err != nil {
			if !g.closed.Load() {
				g.reportError(fmt.Errorf("gateway read failed: %w", err))
			}
			return
		}

		var message gatewayPayload
		if err := json.Unmarshal(payload, &message); err != nil {
			g.reportError(fmt.Errorf("failed to decode gateway payload: %w", err))
			continue
		}

		switch message.Op {
		case gatewayOpHello:
			var hello gatewayHelloPayload
			if err := json.Unmarshal(message.Data, &hello); err != nil {
				g.reportError(fmt.Errorf("failed to decode hello: %w", err))
				continue
			}
			select {
			case g.helloCh <- hello:
			default:
			}
		case gatewayOpGatewayError:
			var gatewayErr struct {
				Code    string `json:"code"`
				Message string `json:"message"`
			}
			if err := json.Unmarshal(message.Data, &gatewayErr); err != nil {
				g.reportError(fmt.Errorf("failed to decode gateway error: %w", err))
				continue
			}
			g.reportError(fmt.Errorf("gateway error %s: %s", gatewayErr.Code, gatewayErr.Message))
		case gatewayOpDispatch:
			g.handleDispatch(message)
		case gatewayOpHeartbeat:
			g.sendHeartbeat()
		case gatewayOpHeartbeatAck:
		case gatewayOpReconnect:
			g.reportError(errors.New("gateway requested reconnect"))
		case gatewayOpInvalidSession:
			g.reportError(errors.New("gateway session invalid"))
		}
	}
}
