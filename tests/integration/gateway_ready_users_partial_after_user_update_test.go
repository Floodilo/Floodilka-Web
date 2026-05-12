/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

func TestGatewayReadyUsersPartialAfterUserUpdate(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	guild := createGuild(t, client, owner.Token, "Ready Partial Leak Guild")
	invite := createChannelInvite(t, client, owner.Token, parseSnowflake(t, guild.SystemChannel))

	member := createTestAccount(t, client)
	joinGuild(t, client, member.Token, invite.Code)

	newBio := fmt.Sprintf("Private bio %d", time.Now().UnixNano())
	resp, err := client.patchJSONWithAuth("/users/@me", map[string]any{"bio": newBio}, owner.Token)
	if err != nil {
		t.Fatalf("failed to update owner bio: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	socket := newGatewayClient(t, client, member.Token)
	t.Cleanup(socket.Close)

	ready := socket.WaitForEvent(t, "READY", 30*time.Second, nil)

	var readyPayload struct {
		Users []map[string]any `json:"users"`
	}
	if err := json.Unmarshal(ready.Data, &readyPayload); err != nil {
		t.Fatalf("failed to decode READY payload: %v", err)
	}
	if len(readyPayload.Users) == 0 {
		t.Fatal("expected READY.users to include at least one user")
	}

	privateKeys := []string{
		"bio",
		"email",
		"phone",
		"mfa_enabled",
		"authenticator_types",
		"premium_type",
		"premium_since",
		"premium_until",
		"premium_will_cancel",
		"premium_billing_cycle",
		"premium_badge_hidden",
		"premium_badge_masked",
		"pending_bulk_message_deletion",
	}
	for _, user := range readyPayload.Users {
		userID, _ := user["id"].(string)
		for _, key := range privateKeys {
			if _, ok := user[key]; ok {
				t.Fatalf("READY user %s unexpectedly contains private key %s", userID, key)
			}
		}
	}
}
