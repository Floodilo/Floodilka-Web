/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"os"
	"strings"
	"testing"
)

func initGatewayClient(
	t testing.TB,
	client *testClient,
	token string,
	resume *gatewayResumeState,
	skipEnsure bool,
) *gatewayClient {
	t.Helper()
	if token == "" {
		t.Fatalf("gateway client requires auth token")
	}
	if !skipEnsure && !strings.HasPrefix(token, "Bot ") {
		ensureSessionStarted(t, client, token)
	}

	headers := http.Header{}
	headers.Set("User-Agent", "FloodilkaIntegrationTests/1.0")
	if origin := os.Getenv("FLOODILKA_WEBAPP_ORIGIN"); origin != "" {
		headers.Set("Origin", origin)
	}
	if client != nil && client.clientIP != "" {
		headers.Set("X-Forwarded-For", client.clientIP)
	}
	if testToken := os.Getenv("FLOODILKA_TEST_TOKEN"); testToken != "" {
		headers.Set("X-Test-Token", testToken)
	}

	gc := &gatewayClient{
		token:         token,
		gatewayURL:    buildGatewayURL(t),
		headers:       headers,
		helloCh:       make(chan gatewayHelloPayload, 1),
		readySignal:   make(chan struct{}, 1),
		resumedSignal: make(chan struct{}, 1),
		dispatchCh:    make(chan gatewayDispatch, 10000),
		errCh:         make(chan error, 2),
	}

	gc.connect(t, resume)
	return gc
}
