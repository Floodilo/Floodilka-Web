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

const (
	guildChannelTypeText     = 0
	guildChannelTypeVoice    = 2
	guildChannelTypeCategory = 4
)

func createGuildChannelOfType(
	t testing.TB,
	client *testClient,
	token string,
	guildID int64,
	name string,
	channelType int,
) minimalChannelResponse {
	t.Helper()
	payload := map[string]any{
		"name": name,
		"type": channelType,
	}
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), payload, token)
	if err != nil {
		t.Fatalf("failed to create channel: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)
	return channel
}
