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

func TestMessageForwardingRejectsMismatchedGuildID(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guildA := createGuild(t, client, user.Token, "Guild A")
	guildB := createGuild(t, client, user.Token, "Guild B")

	targetChannel := createGuildChannel(t, client, user.Token, parseSnowflake(t, guildA.ID), "forward-target")

	originalMessage := sendChannelMessage(
		t,
		client,
		user.Token,
		parseSnowflake(t, guildA.SystemChannel),
		"Source message",
	)

	payload := map[string]any{
		"message_reference": map[string]any{
			"channel_id": guildA.SystemChannel,
			"message_id": originalMessage.ID,
			"guild_id":   guildB.ID,
			"type":       1,
		},
	}

	resp, err := client.postJSONWithAuth(
		fmt.Sprintf("/channels/%d/messages", parseSnowflake(t, targetChannel.ID)),
		payload,
		user.Token,
	)
	if err != nil {
		t.Fatalf("failed to send request: %v", err)
	}
	assertStatus(t, resp, http.StatusBadRequest)
	resp.Body.Close()
}
