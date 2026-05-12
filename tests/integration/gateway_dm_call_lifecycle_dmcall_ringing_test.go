/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"testing"
	"time"
)

func TestDMCallRinging(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	guild := createGuild(t, client, user1.Token, "Test Guild")
	invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, user2.Token, invite.Code)

	dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	gateway1 := newGatewayClient(t, client, user1.Token)
	defer gateway1.Close()

	gateway2 := newGatewayClient(t, client, user2.Token)
	defer gateway2.Close()

	t.Run("user2 can stop ringing", func(t *testing.T) {
		ringCall(t, client, user1.Token, parseSnowflake(t, dm.ID), nil)

		gateway1.WaitForEvent(t, "CALL_CREATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callCreateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			return call.ChannelID == dm.ID
		})

		gateway2.WaitForEvent(t, "CALL_CREATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callCreateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			return call.ChannelID == dm.ID
		})

		gateway1.WaitForEvent(t, "CALL_UPDATE", 10*time.Second, func(data json.RawMessage) bool {
			var call callUpdateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			return call.ChannelID == dm.ID && containsString(call.Ringing, user2.UserID)
		})

		stopRinging(t, client, user2.Token, parseSnowflake(t, dm.ID), nil)

		updateEvent := gateway1.WaitForEvent(t, "CALL_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callUpdateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			return call.ChannelID == dm.ID && !containsString(call.Ringing, user2.UserID)
		})

		var callUpdate callUpdateEvent
		if err := json.Unmarshal(updateEvent.Data, &callUpdate); err != nil {
			t.Fatalf("failed to decode CALL_UPDATE: %v", err)
		}

		if containsString(callUpdate.Ringing, user2.UserID) {
			t.Fatalf("expected user2 to be removed from ringing, got %v", callUpdate.Ringing)
		}

		t.Logf("User2 successfully stopped ringing, ringing array is now: %v", callUpdate.Ringing)
	})
}
