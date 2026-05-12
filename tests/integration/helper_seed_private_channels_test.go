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

type privateChannelEntry struct {
	ChannelID     string `json:"channel_id"`
	LastMessageID string `json:"last_message_id"`
}

type privateChannelSeedResult struct {
	DMs      []privateChannelEntry `json:"dms"`
	GroupDMs []privateChannelEntry `json:"group_dms"`
}

func seedPrivateChannels(t testing.TB, client *testClient, user testAccount, payload map[string]any) privateChannelSeedResult {
	t.Helper()

	resp, err := client.postJSON(fmt.Sprintf("/test/users/%s/private-channels", user.UserID), payload)
	if err != nil {
		t.Fatalf("failed to seed private channels: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)
	var result privateChannelSeedResult
	decodeJSONResponse(t, resp, &result)
	return result
}
