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

func (g *zstdGatewayClient) waitForHello(t testing.TB, timeout time.Duration) gatewayHelloPayload {
	t.Helper()
	select {
	case hello := <-g.helloCh:
		return hello
	case <-time.After(timeout):
		t.Fatalf("timeout waiting for HELLO")
		return gatewayHelloPayload{}
	}
}
