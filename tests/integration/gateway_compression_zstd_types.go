/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	"github.com/klauspost/compress/zstd"
)

type zstdGatewayClient struct {
	token      string
	gatewayURL string
	headers    http.Header

	conn *websocket.Conn

	helloCh         chan gatewayHelloPayload
	readySignal     chan struct{}
	resumedSignal   chan struct{}
	dispatchCh      chan gatewayDispatch
	errCh           chan error
	pendingMu       sync.Mutex
	pendingDispatch []gatewayDispatch

	heartbeatMu    sync.Mutex
	heartbeatTimer *time.Ticker
	heartbeatDone  chan struct{}

	writeMu sync.Mutex
	wg      sync.WaitGroup

	sequence atomic.Int64
	closed   atomic.Bool

	zstdDecoder *zstd.Decoder
}
