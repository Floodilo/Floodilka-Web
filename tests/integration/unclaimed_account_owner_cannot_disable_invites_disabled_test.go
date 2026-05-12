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

// TestUnclaimedAccountOwnerCannotDisableInvitesDisabled verifies that unclaimed account owners
// cannot toggle off the INVITES_DISABLED feature on their preview guilds.
func TestUnclaimedAccountOwnerCannotDisableInvitesDisabled(t *testing.T) {
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

	resp, err = client.patchJSONWithAuth("/guilds/"+guild.ID, map[string]any{
		"features": []string{},
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to update guild: %v", err)
	}
	defer resp.Body.Close()

	assertStatus(t, resp, http.StatusOK)

	var updatedGuild guildCreateResponse
	decodeJSONResponse(t, resp, &updatedGuild)

	if !slices.Contains(updatedGuild.Features, "INVITES_DISABLED") {
		t.Fatalf("INVITES_DISABLED should remain enabled for unclaimed owner's guild, got features: %v", updatedGuild.Features)
	}

	t.Log("Unclaimed account owner cannot disable INVITES_DISABLED test passed")
}
