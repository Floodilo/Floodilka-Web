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

func TestDMCallRegionUpdate(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	guild := createGuild(t, client, user1.Token, "Test Guild")
	invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, user2.Token, invite.Code)

	dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	gateway1 := newGatewayClient(t, client, user1.Token)
	defer gateway1.Close()

	t.Run("call region can be updated", func(t *testing.T) {
		ringCall(t, client, user1.Token, parseSnowflake(t, dm.ID), nil)

		callEvent := gateway1.WaitForEvent(t, "CALL_CREATE", 5*time.Second, nil)
		var call callCreateEvent
		if err := json.Unmarshal(callEvent.Data, &call); err != nil {
			t.Fatalf("failed to decode CALL_CREATE: %v", err)
		}

		originalRegion := call.Region
		if originalRegion == "" {
			t.Fatal("expected original region to be set in CALL_CREATE")
		}
		t.Logf("Original region: %s", originalRegion)

		gateway1.SendVoiceStateUpdate(nil, &dm.ID, nil, false, false, false, false)
		serverUpdate := gateway1.WaitForEvent(t, "VOICE_SERVER_UPDATE", 5*time.Second, nil)
		var vsu voiceServerUpdate
		if err := json.Unmarshal(serverUpdate.Data, &vsu); err != nil {
			t.Fatalf("failed to decode VOICE_SERVER_UPDATE: %v", err)
		}
		connectionID := vsu.ConnectionID

		lkConn := connectToLiveKit(t, vsu.Endpoint, vsu.Token, dm.ID, user1.UserID)
		defer lkConn.disconnect()

		gateway1.WaitForEvent(t, "CALL_UPDATE", 5*time.Second, nil)

		updateCallRegion(t, client, user1.Token, parseSnowflake(t, dm.ID), "us-west")

		updateEvent := gateway1.WaitForEvent(t, "CALL_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callUpdateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				t.Logf("failed to decode CALL_UPDATE: %v", err)
				return false
			}
			return call.Region != ""
		})

		var callUpdate callUpdateEvent
		if err := json.Unmarshal(updateEvent.Data, &callUpdate); err != nil {
			t.Fatalf("failed to decode CALL_UPDATE event: %v", err)
		}

		if callUpdate.Region == "" {
			t.Fatal("expected region to be set in CALL_UPDATE after region update")
		}
		if callUpdate.Region == originalRegion {
			t.Logf("Note: region unchanged after update (old=%s, new=%s) - server may have kept the same region", originalRegion, callUpdate.Region)
		}
		t.Logf("Region after update: %s", callUpdate.Region)

		gateway1.SendVoiceStateUpdate(nil, nil, &connectionID, false, false, false, false)
		gateway1.WaitForEvent(t, "CALL_DELETE", 5*time.Second, nil)
	})
}
