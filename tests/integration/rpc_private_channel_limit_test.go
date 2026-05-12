/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"sort"
	"testing"
	"time"
)

const (
	channelTypeDM      = 1
	channelTypeGroupDM = 3
	maxPrivateChannels = 250
)

func TestRpcSessionPrivateChannelLimit(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	recipients := []testAccount{
		createTestAccount(t, client),
		createTestAccount(t, client),
		createTestAccount(t, client),
	}

	payload := map[string]any{
		"dm_count":       260,
		"group_dm_count": 10,
		"recipients": []string{
			recipients[0].UserID,
			recipients[1].UserID,
			recipients[2].UserID,
		},
		"clear_existing": true,
	}

	seedResult := seedPrivateChannels(t, client, user, payload)
	if len(seedResult.GroupDMs) != 10 {
		t.Fatalf("expected to seed 10 group DMs, got %d", len(seedResult.GroupDMs))
	}

	gateway := newGatewayClient(t, client, user.Token)
	defer gateway.Close()

	ready := gateway.WaitForEvent(t, "READY", 10*time.Second, nil)

	var readyPayload struct {
		PrivateChannels []rpcChannelResponse `json:"private_channels"`
	}
	if err := json.Unmarshal(ready.Data, &readyPayload); err != nil {
		t.Fatalf("failed to decode READY payload: %v", err)
	}

	privateChannels := readyPayload.PrivateChannels
	if len(privateChannels) != maxPrivateChannels {
		t.Fatalf("expected %d private channels, got %d", maxPrivateChannels, len(privateChannels))
	}

	dmMessageIDs := make([]int64, 0, maxPrivateChannels)
	groupCount := 0
	for _, channel := range privateChannels {
		switch channel.Type {
		case channelTypeGroupDM:
			groupCount++
		case channelTypeDM:
			if channel.LastMessageID == "" {
				t.Fatalf("private channel missing last_message_id")
			}
			dmMessageIDs = append(dmMessageIDs, parseSnowflake(t, channel.LastMessageID))
		}
	}

	if groupCount != len(seedResult.GroupDMs) {
		t.Fatalf("expected %d group DMs, got %d", len(seedResult.GroupDMs), groupCount)
	}

	expectedDMs := maxPrivateChannels - groupCount
	if len(dmMessageIDs) != expectedDMs {
		t.Fatalf("expected %d DM channels, got %d", expectedDMs, len(dmMessageIDs))
	}

	seedMessageIDs := make([]int64, len(seedResult.DMs))
	for i, entry := range seedResult.DMs {
		seedMessageIDs[i] = parseSnowflake(t, entry.LastMessageID)
	}

	sort.Slice(seedMessageIDs, func(i, j int) bool {
		return seedMessageIDs[i] < seedMessageIDs[j]
	})

	closedCount := len(seedMessageIDs) - expectedDMs
	if closedCount < 0 {
		t.Fatalf("closedCount (%d) unexpectedly negative", closedCount)
	}

	closedSet := make(map[int64]struct{}, closedCount)
	for i := 0; i < closedCount; i++ {
		closedSet[seedMessageIDs[i]] = struct{}{}
	}

	for _, messageID := range dmMessageIDs {
		if _, exists := closedSet[messageID]; exists {
			t.Fatalf("expected closed DM with last_message_id %d to be omitted", messageID)
		}
	}
}
