/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
	"time"
)

// TestBotGatewayResumeSession verifies that bots can resume their gateway sessions
// after disconnection, maintaining their session state.
func TestBotGatewayResumeSession(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	appName := fmt.Sprintf("Resume Bot %d", time.Now().UnixNano())
	redirectURI := "https://example.com/callback"
	_, _, botToken := createOAuth2BotApplication(t, client, owner, appName, []string{redirectURI})

	gc := newGatewayClient(t, client, botToken)

	resumeState := gatewayResumeState{
		SessionID: gc.SessionID(),
		Sequence:  gc.Sequence(),
	}

	if resumeState.SessionID == "" {
		t.Fatalf("should have session ID after READY")
	}

	t.Logf("Initial session - ID: %s, Sequence: %d", resumeState.SessionID, resumeState.Sequence)

	gc.Close()

	time.Sleep(1 * time.Second)

	gcResume := newGatewayClientWithResume(t, client, botToken, resumeState)
	defer gcResume.Close()

	t.Logf("Session successfully resumed - SessionID: %s", resumeState.SessionID)
}
