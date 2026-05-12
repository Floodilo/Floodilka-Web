/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"testing"
	"time"
)

func (g *zstdGatewayClient) WaitForEvent(t testing.TB, eventType string, timeout time.Duration, matchFunc func(json.RawMessage) bool) json.RawMessage {
	t.Helper()

	g.pendingMu.Lock()
	for i, d := range g.pendingDispatch {
		if d.Type == eventType && (matchFunc == nil || matchFunc(d.Data)) {
			g.pendingDispatch = append(g.pendingDispatch[:i], g.pendingDispatch[i+1:]...)
			g.pendingMu.Unlock()
			return d.Data
		}
	}
	g.pendingMu.Unlock()

	deadline := time.After(timeout)
	for {
		select {
		case d := <-g.dispatchCh:
			if d.Type == eventType && (matchFunc == nil || matchFunc(d.Data)) {
				return d.Data
			}
			g.pendingMu.Lock()
			g.pendingDispatch = append(g.pendingDispatch, d)
			g.pendingMu.Unlock()
		case <-deadline:
			t.Fatalf("timeout waiting for event %s", eventType)
			return nil
		}
	}
}
