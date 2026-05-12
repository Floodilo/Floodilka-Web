/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"sync"
	"testing"
)

var sessionStart sync.Map

func ensureSessionStarted(t testing.TB, client *testClient, token string) {
	t.Helper()
	if token == "" {
		t.Fatalf("cannot start session with empty token")
	}

	once, _ := sessionStart.LoadOrStore(token, &sync.Once{})
	once.(*sync.Once).Do(func() {
		gateway := initGatewayClient(t, client, token, nil, true)
		defer gateway.Close()
	})
}
