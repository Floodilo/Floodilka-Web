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

func TestInviteValidation(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, "Invite Validation Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	t.Run("reject getting nonexistent invite", func(t *testing.T) {
		resp, err := client.getWithAuth("/invites/invalidcode123", owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("reject accepting nonexistent invite", func(t *testing.T) {
		resp, err := client.postJSONWithAuth("/invites/invalidcode123", nil, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("reject deleting nonexistent invite", func(t *testing.T) {
		resp, err := client.delete("/invites/invalidcode123", owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusNotFound)
		resp.Body.Close()
	})

	t.Run("reject invalid max_uses value", func(t *testing.T) {
		payload := map[string]any{"max_uses": -1}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/invites", channelID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("reject invalid max_age value", func(t *testing.T) {
		payload := map[string]any{"max_age": -1}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/invites", channelID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})

	t.Run("accept valid max_uses and max_age", func(t *testing.T) {
		payload := map[string]any{
			"max_uses": 5,
			"max_age":  3600,
		}
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/invites", channelID), payload, owner.Token)
		if err != nil {
			t.Fatalf("failed to create invite: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var invite struct {
			Code string `json:"code"`
		}
		decodeJSONResponse(t, resp, &invite)
		if invite.Code == "" {
			t.Error("expected invite code in response")
		}

		resp, err = client.delete(fmt.Sprintf("/invites/%s", invite.Code), owner.Token)
		if err == nil {
			resp.Body.Close()
		}
	})
}
