/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/url"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func (g *zstdGatewayClient) connect(t testing.TB) {
	t.Helper()

	parsed, err := url.Parse(g.gatewayURL)
	if err != nil {
		t.Fatalf("invalid gateway url %q: %v", g.gatewayURL, err)
	}
	query := parsed.Query()
	query.Set("v", "1")
	query.Set("encoding", "json")
	query.Set("compress", "zstd-stream")
	parsed.RawQuery = query.Encode()
	fullURL := parsed.String()

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

	g.sendIdentify()
	g.waitForReady(t, 15*time.Second)
}
