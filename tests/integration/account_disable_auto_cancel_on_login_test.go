/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

func TestAccountDisableAutoCancelOnLogin(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth("/users/@me/disable", map[string]string{
		"password": account.Password,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to disable account: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	loginResp := loginTestUser(t, client, account.Email, account.Password)
	if loginResp.Token == "" {
		t.Fatal("expected to be able to login")
	}

	resp, err = client.getWithAuth("/users/@me", loginResp.Token)
	if err != nil {
		t.Fatalf("failed to get user: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	_ = parseSnowflake(t, loginResp.UserID)
	otherUser := createTestAccount(t, client)
	otherUserID := parseSnowflake(t, otherUser.UserID)

	guild := createGuild(t, client, loginResp.Token, "Test Guild")
	invite := createChannelInvite(t, client, loginResp.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, otherUser.Token, invite.Code)

	dmChannel := createDmChannel(t, client, loginResp.Token, otherUserID)
	dmChannelID := parseSnowflake(t, dmChannel.ID)
	message := sendChannelMessage(t, client, loginResp.Token, dmChannelID, "test message")

	if message.ID == "" {
		t.Error("expected to be able to send messages after auto-undisable")
	}

	t.Log("Auto-undisable on login test passed")
}
