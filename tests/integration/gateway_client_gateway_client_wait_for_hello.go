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

func (g *gatewayClient) waitForHello(t testing.TB, timeout time.Duration) gatewayHelloPayload {
	t.Helper()
	timer := time.NewTimer(timeout)
	defer timer.Stop()
	select {
	case hello := <-g.helloCh:
		return hello
	case <-timer.C:
		t.Fatalf("timed out waiting for gateway HELLO")
	case err := <-g.errCh:
		t.Fatalf("gateway error before HELLO: %v", err)
	}
	return gatewayHelloPayload{}
}
