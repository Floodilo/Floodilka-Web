/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
)

func (g *gatewayClient) handleDispatch(message gatewayPayload) {

	var seq int64
	if message.Sequence != nil {
		newSeq := int64(*message.Sequence)
		for {
			current := g.sequence.Load()
			if newSeq <= current {
				seq = current
				break
			}
			if g.sequence.CompareAndSwap(current, newSeq) {
				seq = newSeq
				break
			}
		}
	} else {
		seq = g.sequence.Load()
	}

	dispatch := gatewayDispatch{
		Type:     message.Type,
		Data:     message.Data,
		Sequence: seq,
	}

	switch message.Type {
	case "READY":
		var ready struct {
			SessionID string `json:"session_id"`
		}
		if err := json.Unmarshal(message.Data, &ready); err == nil && ready.SessionID != "" {
			g.sessionMu.Lock()
			g.sessionID = ready.SessionID
			g.sessionMu.Unlock()
		}
		select {
		case g.readySignal <- struct{}{}:
		default:
		}

	case "RESUMED":
		select {
		case g.resumedSignal <- struct{}{}:
		default:
		}
	}

	if g.closed.Load() {
		return
	}
	select {
	case g.dispatchCh <- dispatch:
	default:
		panic(fmt.Sprintf("gateway dispatch channel full, dropping %s event (channel buffer: %d, test may not be consuming events)", dispatch.Type, cap(g.dispatchCh)))
	}
}
