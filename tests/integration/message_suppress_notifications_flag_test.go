/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"testing"
)

func TestMessageSendSuppressNotificationsFlag(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	ensureSessionStarted(t, client, owner.Token)

	guild := createGuild(t, client, owner.Token, "Suppress Notifications Flag Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	const suppressNotificationsFlag = 1 << 12

	payload := map[string]any{
		"content": "Quiet message",
		"flags":   suppressNotificationsFlag,
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages", channelID), payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to send message: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	defer resp.Body.Close()

	var message struct {
		Flags int `json:"flags"`
	}
	decodeJSONResponse(t, resp, &message)

	if message.Flags&suppressNotificationsFlag == 0 {
		t.Fatalf("expected suppress notifications flag to be set, got %d", message.Flags)
	}
}
