/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestGatewaySessionTimeout(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	gc := newGatewayClient(t, client, account.Token)
	sessionID := gc.SessionID()
	sequence := gc.Sequence()

	gc.WaitForEvent(t, "READY", 10*time.Second, nil)

	gc.Close()

	time.Sleep(15 * time.Second)

	resume := gatewayResumeState{
		SessionID: sessionID,
		Sequence:  sequence,
	}

	gcResumed := &gatewayClient{
		token:         account.Token,
		gatewayURL:    buildGatewayURL(t),
		headers:       gc.headers,
		helloCh:       make(chan gatewayHelloPayload, 1),
		readySignal:   make(chan struct{}, 1),
		resumedSignal: make(chan struct{}, 1),
		dispatchCh:    make(chan gatewayDispatch, 512),
		errCh:         make(chan error, 2),
	}
	defer gcResumed.Close()

	fullURL := appendGatewayQuery(t, gcResumed.gatewayURL)
	dialer := websocket.Dialer{HandshakeTimeout: 15 * time.Second}
	conn, _, err := dialer.Dial(fullURL, gcResumed.headers)
	if err != nil {
		t.Fatalf("failed to dial gateway for resume: %v", err)
	}

	gcResumed.conn = conn
	gcResumed.wg.Add(1)
	go gcResumed.readLoop()

	hello := gcResumed.waitForHello(t, 10*time.Second)
	gcResumed.startHeartbeat(time.Duration(hello.HeartbeatInterval) * time.Millisecond)

	gcResumed.sessionMu.Lock()
	gcResumed.sessionID = resume.SessionID
	gcResumed.sessionMu.Unlock()
	gcResumed.sequence.Store(resume.Sequence)
	gcResumed.sendResume(resume.SessionID, resume.Sequence)

	select {
	case err := <-gcResumed.errCh:
		if strings.Contains(err.Error(), "gateway session invalid") {
			return
		}
		t.Fatalf("unexpected error during resume: %v", err)
	case <-gcResumed.resumedSignal:
		t.Fatalf("session resumed unexpectedly (should have timed out)")
	case <-time.After(15 * time.Second):
		t.Fatalf("timed out waiting for invalid session error")
	}
}
