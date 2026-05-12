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

func TestScheduledMessageFeatureFlagGating(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, "scheduled-flag")
	channel := createGuildChannel(t, client, owner.Token, parseSnowflake(t, guild.ID), "scheduled-channel")
	channelID := parseSnowflake(t, channel.ID)

	payload := map[string]any{
		"content":            "trying to schedule",
		"scheduled_local_at": time.Now().UTC().Add(1 * time.Minute).Format(time.RFC3339),
		"timezone":           "UTC",
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/messages/schedule", channelID), payload, owner.Token)
	if err != nil {
		t.Fatalf("failed to schedule message before feature enabled: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusForbidden)

	adminToken := featureFlagAdminToken(t, client, []string{"feature_flag:manage"})
	updateFeatureFlagGuilds(t, client, adminToken, "message_scheduling", []string{guild.ID})

	scheduled := scheduleMessage(t, client, channelID, owner.Token, "enabled now")
	if scheduled.ID == "" {
		t.Fatalf("expected scheduled message to be created")
	}
}
