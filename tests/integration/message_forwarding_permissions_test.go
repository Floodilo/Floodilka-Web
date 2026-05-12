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

func TestMessageForwardingPermissions(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)
	user3 := createTestAccount(t, client)
	ensureSessionStarted(t, client, user1.Token)
	ensureSessionStarted(t, client, user2.Token)
	ensureSessionStarted(t, client, user3.Token)

	createFriendship(t, client, user1, user2)

	guild := createGuild(t, client, user1.Token, "Test Guild")
	invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, user2.Token, invite.Code)
	joinGuild(t, client, user3.Token, invite.Code)

	channel := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))
	originalMessage := sendChannelMessage(t, client, user1.Token, parseSnowflake(t, channel.ID), "Private message")

	t.Run("can forward message from inaccessible channel", func(t *testing.T) {
		user3Channel := createDmChannel(t, client, user3.Token, parseSnowflake(t, user1.UserID))

		forwardPayload := map[string]any{
			"message_reference": map[string]any{
				"message_id": originalMessage.ID,
				"channel_id": channel.ID,
				"type":       1,
			},
		}
		resp, err := client.postJSONWithAuth(
			fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, user3Channel.ID)),
			forwardPayload,
			user3.Token,
		)
		if err != nil {
			t.Fatalf("failed to send forward request: %v", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("expected forward to succeed for user without access to source channel, got status %d", resp.StatusCode)
		}
		resp.Body.Close()
	})
}
