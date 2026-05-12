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

func TestMessageFetchBeforeSparseBucketsBeyondIndexLimit(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	guild := createGuild(t, client, account.Token, "Before Sparse Buckets Test")
	channelID := parseSnowflake(t, guild.SystemChannel)
	clearChannelMessages(t, client, channelID, account.Token)

	const bucketCount = 60
	timestamps := make([]time.Time, bucketCount)

	base := time.Now().Add(-time.Hour * 24 * 10 * (bucketCount - 1))
	for i := 0; i < bucketCount; i++ {
		timestamps[i] = base.Add(time.Hour * 24 * 10 * time.Duration(i))
	}

	seed := seedMessagesAtTimestamps(t, client, channelID, timestamps, account.UserID)

	anchor := seed.Messages[bucketCount-1].MessageID // newest
	const limit = 50

	resp, err := client.getWithAuth(
		fmt.Sprintf("/channels/%d/messages?before=%s&limit=%d", channelID, anchor, limit),
		account.Token,
	)
	if err != nil {
		t.Fatalf("fetch failed: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var messages []struct{ ID string }
	decodeJSONResponse(t, resp, &messages)

	if len(messages) != limit {
		t.Fatalf("expected %d messages, got %d", limit, len(messages))
	}
}
