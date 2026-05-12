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

func TestDMCallJoinUpdatesCallState(t *testing.T) {
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

	t.Run("voice state join updates call state", func(t *testing.T) {
		ringCall(t, client, user1.Token, parseSnowflake(t, dm.ID), nil)

		gateway1.WaitForEvent(t, "CALL_CREATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callCreateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			return call.ChannelID == dm.ID
		})

		gateway2.WaitForEvent(t, "CALL_CREATE", 5*time.Second, nil)

		gateway1.SendVoiceStateUpdate(nil, &dm.ID, nil, false, false, false, false)

		serverUpdate := gateway1.WaitForEvent(t, "VOICE_SERVER_UPDATE", 5*time.Second, nil)
		var vsu voiceServerUpdate
		if err := json.Unmarshal(serverUpdate.Data, &vsu); err != nil {
			t.Fatalf("failed to decode VOICE_SERVER_UPDATE: %v", err)
		}

		connectionID := vsu.ConnectionID
		t.Logf("User1 got voice server update: endpoint=%s, connection_id=%s", vsu.Endpoint, connectionID)

		lkConn := connectToLiveKit(t, vsu.Endpoint, vsu.Token, dm.ID, user1.UserID)
		defer lkConn.disconnect()

		gateway1.WaitForEvent(t, "VOICE_STATE_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var vs voiceStateUpdate
			if err := json.Unmarshal(data, &vs); err != nil {
				return false
			}
			return vs.UserID == user1.UserID && vs.ConnectionID == connectionID
		})

		callUpdateEventMsg := gateway1.WaitForEvent(t, "CALL_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callUpdateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			for _, vs := range call.VoiceStates {
				if vs.UserID == user1.UserID {
					return true
				}
			}
			return false
		})

		var callUpdate callUpdateEvent
		if err := json.Unmarshal(callUpdateEventMsg.Data, &callUpdate); err != nil {
			t.Fatalf("failed to decode CALL_UPDATE: %v", err)
		}

		found := false
		for _, vs := range callUpdate.VoiceStates {
			if vs.UserID == user1.UserID {
				found = true
				break
			}
		}
		if !found {
			t.Fatalf("expected user1 (%s) to be in voice_states, got %+v", user1.UserID, callUpdate.VoiceStates)
		}

		t.Logf("User1 joined call, voice_states now has %d users", len(callUpdate.VoiceStates))

		gateway2.SendVoiceStateUpdate(nil, &dm.ID, nil, false, false, false, false)

		serverUpdate2 := gateway2.WaitForEvent(t, "VOICE_SERVER_UPDATE", 5*time.Second, nil)
		var vsu2 voiceServerUpdate
		if err := json.Unmarshal(serverUpdate2.Data, &vsu2); err != nil {
			t.Fatalf("failed to decode user2 VOICE_SERVER_UPDATE: %v", err)
		}

		lkConn2 := connectToLiveKit(t, vsu2.Endpoint, vsu2.Token, dm.ID, user2.UserID)
		defer lkConn2.disconnect()

		callUpdateEventMsg2 := gateway1.WaitForEvent(t, "CALL_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var call callUpdateEvent
			if err := json.Unmarshal(data, &call); err != nil {
				return false
			}
			hasUser1, hasUser2 := false, false
			for _, vs := range call.VoiceStates {
				if vs.UserID == user1.UserID {
					hasUser1 = true
				}
				if vs.UserID == user2.UserID {
					hasUser2 = true
				}
			}
			return hasUser1 && hasUser2
		})

		if err := json.Unmarshal(callUpdateEventMsg2.Data, &callUpdate); err != nil {
			t.Fatalf("failed to decode CALL_UPDATE: %v", err)
		}

		if containsString(callUpdate.Ringing, user2.UserID) {
			t.Fatalf("expected user2 to be removed from ringing after joining, got %v", callUpdate.Ringing)
		}

		t.Logf("Both users in call, voice_states has %d users, ringing: %v",
			len(callUpdate.VoiceStates), callUpdate.Ringing)
	})
}
