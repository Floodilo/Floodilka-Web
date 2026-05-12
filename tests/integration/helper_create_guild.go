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

func createGuild(t testing.TB, client *testClient, token, name string, extra ...map[string]any) guildCreateResponse {
	t.Helper()
	payload := map[string]any{"name": name}
	for _, additional := range extra {
		for key, value := range additional {
			payload[key] = value
		}
	}

	resp, err := client.postJSONWithAuth("/guilds", payload, token)
	if err != nil {
		t.Fatalf("failed to create guild: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var guild guildCreateResponse
	decodeJSONResponse(t, resp, &guild)
	if guild.ID == "" || guild.SystemChannel == "" {
		t.Fatalf("guild response missing id or system channel")
	}
	return guild
}
