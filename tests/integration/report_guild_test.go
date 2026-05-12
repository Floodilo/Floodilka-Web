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

func TestReportGuild(t *testing.T) {
	client := newTestClient(t)
	reporter := createTestAccount(t, client)

	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, "Bad Guild")

	channel := createGuildChannel(t, client, owner.Token, parseSnowflake(t, guild.ID), "general")
	invite := createChannelInvite(t, client, owner.Token, parseSnowflake(t, channel.ID))
	joinGuild(t, client, reporter.Token, invite.Code)

	t.Run("can report a guild", func(t *testing.T) {
		req := map[string]any{
			"guild_id":        guild.ID,
			"category":        "illegal_activity",
			"additional_info": "This guild contains illegal content",
		}

		resp, err := client.postJSONWithAuth("/reports/guild", req, reporter.Token)
		if err != nil {
			t.Fatalf("failed to report guild: %v", err)
		}
		defer resp.Body.Close()

		assertStatus(t, resp, http.StatusOK)

		var result map[string]any
		decodeJSONResponse(t, resp, &result)

		if _, ok := result["report_id"]; !ok {
			t.Fatal("expected report_id in response")
		}
	})
}
