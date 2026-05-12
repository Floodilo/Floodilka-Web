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

func createDmChannel(t testing.TB, client *testClient, token string, recipientID int64) minimalChannelResponse {
	t.Helper()
	payload := map[string]string{"recipient_id": formatSnowflake(recipientID)}
	resp, err := client.postJSONWithAuth("/users/@me/channels", payload, token)
	if err != nil {
		t.Fatalf("failed to create DM channel: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)
	if channel.ID == "" {
		t.Fatalf("dm channel response missing id")
	}
	return channel
}

func createGroupDmChannel(t testing.TB, client *testClient, token string, recipientIDs ...string) minimalChannelResponse {
	t.Helper()
	if len(recipientIDs) == 0 {
		t.Fatalf("createGroupDmChannel requires at least one recipient")
	}

	payload := map[string]any{"recipients": recipientIDs}
	resp, err := client.postJSONWithAuth("/users/@me/channels", payload, token)
	if err != nil {
		t.Fatalf("failed to create group DM channel: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var channel minimalChannelResponse
	decodeJSONResponse(t, resp, &channel)
	if channel.ID == "" {
		t.Fatalf("group DM channel response missing id")
	}
	return channel
}
