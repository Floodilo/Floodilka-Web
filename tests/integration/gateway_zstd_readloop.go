/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"time"

	"github.com/gorilla/websocket"
)

func (g *zstdGatewayClient) readLoop() {
	defer g.wg.Done()

	for {
		if g.closed.Load() {
			return
		}

		_ = g.conn.SetReadDeadline(time.Now().Add(90 * time.Second))
		msgType, data, err := g.conn.ReadMessage()
		if err != nil {
			if !g.closed.Load() {
				select {
				case g.errCh <- err:
				default:
				}
			}
			return
		}

		var jsonData []byte

		if msgType == websocket.BinaryMessage {
			jsonData, err = g.zstdDecoder.DecodeAll(data, nil)
			if err != nil {
				select {
				case g.errCh <- err:
				default:
				}
				continue
			}
		} else {
			jsonData = data
		}

		var payload gatewayPayload
		if err := json.Unmarshal(jsonData, &payload); err != nil {
			continue
		}

		g.handlePayload(payload)
	}
}
