/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
	"time"
)

func (g *gatewayClient) waitForSignal(t testing.TB, ch <-chan struct{}, timeout time.Duration, label string) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for {
		remaining := time.Until(deadline)
		if remaining <= 0 {
			t.Fatalf("timed out waiting for gateway %s event", label)
		}

		select {
		case <-ch:
			return
		case err := <-g.errCh:
			t.Fatalf("gateway error while waiting for %s: %v", label, err)
		case <-time.After(remaining):
			t.Fatalf("timed out waiting for gateway %s event", label)
		}
	}
}
