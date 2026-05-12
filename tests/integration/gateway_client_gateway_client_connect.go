/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"github.com/gorilla/websocket"
	"testing"
	"time"
)

func (g *gatewayClient) connect(t testing.TB, resume *gatewayResumeState) {
	t.Helper()

	fullURL := appendGatewayQuery(t, g.gatewayURL)
	dialer := websocket.Dialer{HandshakeTimeout: 15 * time.Second}
	conn, resp, err := dialer.Dial(fullURL, g.headers)
	if resp != nil {
		resp.Body.Close()
	}
	if err != nil {
		t.Fatalf("failed to dial gateway %s: %v", fullURL, err)
	}

	g.conn = conn
	g.wg.Add(1)
	go g.readLoop()

	hello := g.waitForHello(t, 10*time.Second)
	g.startHeartbeat(time.Duration(hello.HeartbeatInterval) * time.Millisecond)

	if resume != nil {
		if resume.SessionID == "" {
			t.Fatalf("cannot resume gateway session without session id")
		}
		g.sessionMu.Lock()
		g.sessionID = resume.SessionID
		g.sessionMu.Unlock()
		g.sequence.Store(resume.Sequence)
		g.sendResume(resume.SessionID, resume.Sequence)
		g.waitForResumed(t, 15*time.Second)
	} else {
		g.sendIdentify()
		g.waitForReady(t, 15*time.Second)
	}
}
