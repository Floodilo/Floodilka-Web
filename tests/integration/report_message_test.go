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

func TestReportMessage(t *testing.T) {
	client := newTestClient(t)
	reporter := createTestAccount(t, client)

	author := createTestAccount(t, client)
	ensureSessionStarted(t, client, author.Token)
	guild := createGuild(t, client, author.Token, "Report Test Guild")
	channel := createGuildChannel(t, client, author.Token, parseSnowflake(t, guild.ID), "general")

	msg := sendChannelMessage(t, client, author.Token, parseSnowflake(t, channel.ID), "This is a bad message")

	invite := createChannelInvite(t, client, author.Token, parseSnowflake(t, channel.ID))
	joinGuild(t, client, reporter.Token, invite.Code)

	t.Run("can report a message", func(t *testing.T) {
		req := map[string]any{
			"channel_id":      channel.ID,
			"message_id":      msg.ID,
			"category":        "spam",
			"additional_info": "This message is spamming",
		}

		resp, err := client.postJSONWithAuth("/reports/message", req, reporter.Token)
		if err != nil {
			t.Fatalf("failed to report message: %v", err)
		}
		defer resp.Body.Close()

		assertStatus(t, resp, http.StatusOK)

		var result map[string]any
		decodeJSONResponse(t, resp, &result)

		if _, ok := result["report_id"]; !ok {
			t.Fatal("expected report_id in response")
		}
		status, ok := result["status"]
		if !ok {
			t.Fatal("expected status in response")
		}
		if status != "pending" {
			t.Errorf("expected status 'pending', got %v", status)
		}
	})
}
