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

const invitePermsEveryoneMask = "137543274048" // keep the defined voice/text bits only so no unknown perms slip in.

func TestInvitePermissions(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	member := createTestAccount(t, client)

	ensureSessionStarted(t, client, owner.Token)
	ensureSessionStarted(t, client, member.Token)

	guild := createGuild(t, client, owner.Token, "Invite Perms Guild")
	guildID := parseSnowflake(t, guild.ID)
	channelID := parseSnowflake(t, guild.SystemChannel)

	everyoneRoleID := guild.ID
	resp, err := client.patchJSONWithAuth(
		fmt.Sprintf("/guilds/%d/roles/%s", guildID, everyoneRoleID),
		map[string]any{
			"permissions": invitePermsEveryoneMask,
		},
		owner.Token,
	)
	if err != nil {
		t.Fatalf("failed to update role: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	invite := createChannelInvite(t, client, owner.Token, channelID)
	resp, err = client.postJSONWithAuth(fmt.Sprintf("/invites/%s", invite.Code), nil, member.Token)
	if err != nil {
		t.Fatalf("failed to accept invite: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	t.Run("member cannot create invite without CREATE_INSTANT_INVITE", func(t *testing.T) {
		resp, err := client.postJSONWithAuth(fmt.Sprintf("/channels/%d/invites", channelID), map[string]any{}, member.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()
	})

	ownerInvite := createChannelInvite(t, client, owner.Token, channelID)

	t.Run("member cannot delete invite without MANAGE_CHANNELS", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/invites/%s", ownerInvite.Code), member.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()
	})

	t.Run("member cannot get channel invites without MANAGE_CHANNELS", func(t *testing.T) {
		resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/invites", channelID), member.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()
	})

	t.Run("member cannot get guild invites without MANAGE_GUILD", func(t *testing.T) {
		guildID := parseSnowflake(t, guild.ID)
		resp, err := client.getWithAuth(fmt.Sprintf("/guilds/%d/invites", guildID), member.Token)
		if err != nil {
			t.Fatalf("failed to make request: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		resp.Body.Close()
	})

	t.Run("owner can delete invite", func(t *testing.T) {
		resp, err := client.delete(fmt.Sprintf("/invites/%s", ownerInvite.Code), owner.Token)
		if err != nil {
			t.Fatalf("failed to delete invite: %v", err)
		}
		assertStatus(t, resp, http.StatusNoContent)
		resp.Body.Close()
	})
}
