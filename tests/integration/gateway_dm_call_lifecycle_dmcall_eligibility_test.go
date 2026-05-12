/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import "testing"

func TestDMCallEligibility(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	guild := createGuild(t, client, user1.Token, "Test Guild")
	invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, user2.Token, invite.Code)

	createFriendship(t, client, user1, user2)

	dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	t.Run("check call eligibility", func(t *testing.T) {
		eligibility := getCallEligibility(t, client, user1.Token, parseSnowflake(t, dm.ID))

		if !eligibility.Ringable {
			t.Errorf("Expected call to be ringable for fresh users with default settings, got ringable=%v", eligibility.Ringable)
		}

		if eligibility.Silent {
			t.Errorf("Expected call not to be silent for fresh users with default settings, got silent=%v", eligibility.Silent)
		}
	})
}
