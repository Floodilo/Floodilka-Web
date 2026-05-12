/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"

	"github.com/klauspost/compress/zstd"
)

func newZstdGatewayClient(t testing.TB, client *testClient, token string) *zstdGatewayClient {
	t.Helper()

	decoder, err := zstd.NewReader(nil)
	if err != nil {
		t.Fatalf("failed to create zstd decoder: %v", err)
	}

	gc := &zstdGatewayClient{
		token:         token,
		gatewayURL:    buildGatewayURL(t),
		headers:       buildHeaders(t, client),
		helloCh:       make(chan gatewayHelloPayload, 1),
		readySignal:   make(chan struct{}),
		resumedSignal: make(chan struct{}),
		dispatchCh:    make(chan gatewayDispatch, 100),
		errCh:         make(chan error, 1),
		heartbeatDone: make(chan struct{}),
		zstdDecoder:   decoder,
	}

	gc.connect(t)
	return gc
}
