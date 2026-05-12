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

// TestUnclaimedAccountCanCreateGuildWithInvitesDisabled verifies that unclaimed accounts
// can create preview guilds, which automatically have INVITES_DISABLED feature enabled.
func TestUnclaimedAccountCanCreateGuildWithInvitesDisabled(t *testing.T) {
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

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 for unclaimed account creating guild, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var guild guildCreateResponse
	decodeJSONResponse(t, resp, &guild)

	if guild.ID == "" {
		t.Fatalf("guild response missing id")
	}

	if !slices.Contains(guild.Features, "INVITES_DISABLED") {
		t.Fatalf("expected preview guild to have INVITES_DISABLED feature, got features: %v", guild.Features)
	}

	t.Log("Unclaimed account can create guild with INVITES_DISABLED test passed")
}
