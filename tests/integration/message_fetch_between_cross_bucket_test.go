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
	"time"
)

func TestMessageFetchBetweenCrossBucket(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	guild := createGuild(t, client, account.Token, "Between Cross Bucket Test")
	channelID := parseSnowflake(t, guild.SystemChannel)
	clearChannelMessages(t, client, channelID, account.Token)

	timestamps := []time.Time{
		time.Now().Add(-time.Hour * 24 * 30),
		time.Now().Add(-time.Hour * 24 * 20),
		time.Now().Add(-time.Hour * 24 * 10),
		time.Now(),
	}

	seed := seedMessagesAtTimestamps(t, client, channelID, timestamps, account.UserID)

	resp, err := client.getWithAuth(
		fmt.Sprintf(
			"/channels/%d/messages?after=%s&before=%s",
			channelID,
			seed.Messages[0].MessageID,
			seed.Messages[3].MessageID,
		),
		account.Token,
	)
	if err != nil {
		t.Fatalf("fetch failed: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var messages []struct{ ID string }
	decodeJSONResponse(t, resp, &messages)

	if len(messages) != 2 {
		t.Fatalf("expected 2 messages, got %d", len(messages))
	}
}
