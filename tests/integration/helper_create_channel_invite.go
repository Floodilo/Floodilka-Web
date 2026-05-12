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

func createChannelInvite(t testing.TB, client *testClient, token string, channelID int64) inviteResponse {
	t.Helper()
	resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/invites", channelID), map[string]any{}, token)
	if err != nil {
		t.Fatalf("failed to create invite: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var invite inviteResponse
	decodeJSONResponse(t, resp, &invite)
	if invite.Code == "" {
		t.Fatalf("expected invite code in response")
	}
	return invite
}
