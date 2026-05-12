/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

const (
	gatewayOpDispatch         = 0
	gatewayOpHeartbeat        = 1
	gatewayOpIdentify         = 2
	gatewayOpVoiceStateUpdate = 4
	gatewayOpResume           = 6
	gatewayOpReconnect        = 7
	gatewayOpInvalidSession   = 9
	gatewayOpHello            = 10
	gatewayOpHeartbeatAck     = 11
	gatewayOpGatewayError     = 12
)

type gatewayResumeState struct {
	SessionID string
	Sequence  int64
}

type gatewayClient struct {
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

	sessionMu sync.Mutex
	sessionID string

	sequence atomic.Int64
	closed   atomic.Bool
}

type gatewayHelloPayload struct {
	HeartbeatInterval int `json:"heartbeat_interval"`
}

type gatewayPayload struct {
	Op       int             `json:"op"`
	Data     json.RawMessage `json:"d"`
	Sequence *int            `json:"s"`
	Type     string          `json:"t"`
}

type gatewayDispatch struct {
	Type     string
	Data     json.RawMessage
	Sequence int64
}
