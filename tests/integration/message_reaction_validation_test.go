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

func TestMessageReactionValidation(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Reaction Validation Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)
	message := sendChannelMessage(t, client, user.Token, channelID, "test message")

	t.Run("reject invalid limit parameters for GET reactions", func(t *testing.T) {
		testCases := []struct {
			name       string
			limitParam string
		}{
			{"limit too high", "limit=6000"},
			{"limit zero", "limit=0"},
			{"limit negative", "limit=-1"},
			{"limit non-integer", "limit=3.5"},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d/reactions/👍?%s",
					channelID, parseSnowflake(t, message.ID), tc.limitParam), user.Token)
				if err != nil {
					t.Fatalf("failed to make request: %v", err)
				}
				assertStatus(t, resp, http.StatusBadRequest)
				resp.Body.Close()
			})
		}
	})

	t.Run("accept valid limit and pagination parameters", func(t *testing.T) {
		resp, err := client.putWithAuth(fmt.Sprintf("/channels/%d/messages/%d/reactions/👍/@me",
			channelID, parseSnowflake(t, message.ID)), user.Token)
		if err != nil {
			t.Fatalf("failed to add reaction: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()

		resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d/reactions/👍?limit=10",
			channelID, parseSnowflake(t, message.ID)), user.Token)
		if err != nil {
			t.Fatalf("failed to get reactions with valid limit: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		resp.Body.Close()

		resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d/messages/%d/reactions/👍?limit=50&after=%s",
			channelID, parseSnowflake(t, message.ID), user.UserID), user.Token)
		if err != nil {
			t.Fatalf("failed to get reactions with limit and after: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		resp.Body.Close()
	})
}
