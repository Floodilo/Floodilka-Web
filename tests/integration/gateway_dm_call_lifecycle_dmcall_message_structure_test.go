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

	"github.com/stretchr/testify/require"
)

func TestDMCallMessageStructure(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	guild := createGuild(t, client, user1.Token, "Test Guild")
	invite := createChannelInvite(t, client, user1.Token, parseSnowflake(t, guild.SystemChannel))
	joinGuild(t, client, user2.Token, invite.Code)

	dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	gateway1 := newGatewayClient(t, client, user1.Token)
	defer gateway1.Close()

	t.Run("call message has correct structure during active call", func(t *testing.T) {
		ringCall(t, client, user1.Token, parseSnowflake(t, dm.ID), nil)

		gateway1.WaitForEvent(t, "CALL_CREATE", 5*time.Second, nil)

		gateway1.SendVoiceStateUpdate(nil, &dm.ID, nil, false, false, false, false)
		serverUpdate := gateway1.WaitForEvent(t, "VOICE_SERVER_UPDATE", 5*time.Second, nil)
		var vsu voiceServerUpdate
		if err := json.Unmarshal(serverUpdate.Data, &vsu); err != nil {
			t.Fatalf("failed to decode VOICE_SERVER_UPDATE: %v", err)
		}
		connectionID := vsu.ConnectionID

		lkConn := connectToLiveKit(t, vsu.Endpoint, vsu.Token, dm.ID, user1.UserID)
		defer lkConn.disconnect()

		gateway1.WaitForEvent(t, "VOICE_STATE_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var vs voiceStateUpdate
			if err := json.Unmarshal(data, &vs); err != nil {
				t.Logf("failed to decode VOICE_STATE_UPDATE: %v", err)
				return false
			}
			return vs.UserID == user1.UserID && vs.ConnectionID == connectionID
		})

		time.Sleep(500 * time.Millisecond)

		callMsg := findCallMessage(t, client, user1.Token, parseSnowflake(t, dm.ID))
		if callMsg == nil {
			t.Fatal("expected to find CALL message in channel")
			return
		}

		if callMsg.Type != 3 {
			t.Fatalf("expected message type 3 (CALL), got %d", callMsg.Type)
		}

		require.NotNil(t, callMsg.Call, "call object should not be nil")
		require.Nil(t, callMsg.Call.EndedTimestamp, "ended_timestamp should be nil during active call")

		gateway1.SendVoiceStateUpdate(nil, nil, &connectionID, false, false, false, false)

		gateway1.WaitForEvent(t, "CALL_DELETE", 5*time.Second, nil)

		time.Sleep(500 * time.Millisecond)

		callMsgAfter := findCallMessage(t, client, user1.Token, parseSnowflake(t, dm.ID))
		if callMsgAfter == nil {
			t.Fatal("expected CALL message to still exist after call ended")
			return
		}

		callAfter := callMsgAfter.Call
		require.NotNil(t, callAfter, "call object should not be nil after call ended")
		require.NotNil(t, callAfter.EndedTimestamp, "ended_timestamp should be set after call ended")
		require.NotEmpty(t, callAfter.Participants, "participants array should not be empty")
		require.Contains(t, callAfter.Participants, user1.UserID, "user1 should be in participants")
	})
}
