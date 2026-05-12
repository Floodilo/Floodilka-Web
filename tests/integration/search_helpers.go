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
	"time"
)

type messageSearchResponse struct {
	Messages []messageResponse `json:"messages"`
	Total    int               `json:"total"`
	Offset   int               `json:"offset"`
	Limit    int               `json:"limit"`
}

func waitForSearchResults(t testing.TB, client *testClient, token string, payload map[string]any) messageSearchResponse {
	t.Helper()
	const maxAttempts = 12
	for attempt := 0; attempt < maxAttempts; attempt++ {
		resp, err := client.postJSONWithAuth("/search/messages", payload, token)
		if err != nil {
			t.Fatalf("failed to search messages: %v", err)
		}
		if resp.StatusCode == http.StatusAccepted {
			resp.Body.Close()
			time.Sleep(250 * time.Millisecond)
			continue
		}
		assertStatus(t, resp, http.StatusOK)
		var result messageSearchResponse
		decodeJSONResponse(t, resp, &result)
		return result
	}
	t.Fatalf("search still indexing after %d attempts", maxAttempts)
	return messageSearchResponse{}
}

func channelSetFromSearch(result messageSearchResponse) map[string]struct{} {
	set := make(map[string]struct{}, len(result.Messages))
	for _, msg := range result.Messages {
		set[msg.ChannelID] = struct{}{}
	}
	return set
}

func requireExactChannels(t testing.TB, scope string, actual map[string]struct{}, expected []string) {
	t.Helper()
	if len(actual) != len(expected) {
		t.Fatalf("%s: expected %d channels but got %d", scope, len(expected), len(actual))
	}
	for _, id := range expected {
		if _, ok := actual[id]; !ok {
			t.Fatalf("%s: expected channel %s to be present", scope, id)
		}
	}
}
