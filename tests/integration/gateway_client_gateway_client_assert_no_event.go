/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"context"
	"encoding/json"
	"errors"
	"testing"
	"time"
)

func (g *gatewayClient) AssertNoEvent(t testing.TB, eventType string, duration time.Duration, match func(json.RawMessage) bool) {
	t.Helper()
	deadline := time.Now().Add(duration)
	for {
		remaining := time.Until(deadline)
		if remaining <= 0 {
			return
		}
		dispatch, err := g.nextDispatch(remaining)
		if errors.Is(err, context.DeadlineExceeded) {
			return
		}
		if err != nil {
			t.Fatalf("gateway client error while asserting no %s: %v", eventType, err)
		}
		if dispatch.Type == eventType {
			if match == nil || match(dispatch.Data) {
				t.Fatalf("received unexpected gateway event %s: %s", eventType, string(dispatch.Data))
			}
		}
		g.pushPending(dispatch)
	}
}
