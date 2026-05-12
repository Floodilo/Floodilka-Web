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

func TestGatewaySessionResume(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	initialSocket := newGatewayClient(t, client, account.Token)
	t.Cleanup(initialSocket.Close)

	sessionID := initialSocket.SessionID()
	if sessionID == "" {
		t.Fatalf("expected session id after READY")
	}
	sequence := initialSocket.Sequence()

	initialSocket.Close()

	resumedSocket := newGatewayClientWithResume(t, client, account.Token, gatewayResumeState{
		SessionID: sessionID,
		Sequence:  sequence,
	})
	t.Cleanup(resumedSocket.Close)

	resumedSocket.WaitForEvent(t, "RESUMED", 30*time.Second, nil)
}
