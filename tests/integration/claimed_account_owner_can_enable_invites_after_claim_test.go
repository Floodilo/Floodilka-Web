/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"slices"
	"testing"
)

// TestClaimedAccountOwnerCanEnableInvitesAfterClaim verifies that after an unclaimed account owner
// claims their account, they can enable invites by toggling off INVITES_DISABLED.
func TestClaimedAccountOwnerCanEnableInvitesAfterClaim(t *testing.T) {
	client := newTestClient(t)

	account := createTestAccount(t, client)

	unclaimAccount(t, client, account.UserID)

	resp, err := client.postJSONWithAuth("/guilds", map[string]string{
		"name": "Preview Guild",
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to create guild: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var guild guildCreateResponse
	decodeJSONResponse(t, resp, &guild)

	if !slices.Contains(guild.Features, "INVITES_DISABLED") {
		t.Fatalf("expected preview guild to have INVITES_DISABLED feature")
	}

	newPassword := uniquePassword()
	claimResp, err := client.patchJSONWithAuth("/users/@me", map[string]any{
		"new_password": newPassword,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to claim account: %v", err)
	}
	defer claimResp.Body.Close()
	assertStatus(t, claimResp, http.StatusOK)

	updateResp, err := client.patchJSONWithAuth("/guilds/"+guild.ID, map[string]any{
		"features": []string{},
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to update guild features: %v", err)
	}
	defer updateResp.Body.Close()
	assertStatus(t, updateResp, http.StatusOK)

	var updatedGuild guildCreateResponse
	decodeJSONResponse(t, updateResp, &updatedGuild)

	if slices.Contains(updatedGuild.Features, "INVITES_DISABLED") {
		t.Fatalf("INVITES_DISABLED should be removable after owner claims account, got features: %v", updatedGuild.Features)
	}

	t.Log("Claimed account owner can enable invites after claim test passed")
}
