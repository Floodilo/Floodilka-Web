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

func (g *gatewayClient) WaitForEvent(t testing.TB, eventType string, timeout time.Duration, match func(json.RawMessage) bool) gatewayDispatch {
	t.Helper()
	deadline := time.Now().Add(timeout)
	var skipped []gatewayDispatch
	defer func() {
		for _, dispatch := range skipped {
			g.pushPending(dispatch)
		}
	}()

	for {
		dispatch, ok := g.popPending()
		if !ok {
			break
		}
		if dispatch.Type == eventType && (match == nil || match(dispatch.Data)) {
			for _, d := range skipped {
				g.pushPending(d)
			}
			skipped = nil
			return dispatch
		}
		skipped = append(skipped, dispatch)
	}

	for {
		remaining := time.Until(deadline)
		if remaining <= 0 {
			t.Fatalf("timed out waiting for gateway event %s", eventType)
		}
		dispatch, err := g.nextDispatchFromChannel(remaining)
		if errors.Is(err, context.DeadlineExceeded) {
			t.Fatalf("timed out waiting for gateway event %s", eventType)
		}
		if err != nil {
			t.Fatalf("gateway client error while waiting for %s: %v", eventType, err)
		}
		if dispatch.Type == eventType && (match == nil || match(dispatch.Data)) {
			for _, d := range skipped {
				g.pushPending(d)
			}
			skipped = nil
			return dispatch
		}
		skipped = append(skipped, dispatch)
	}
}
