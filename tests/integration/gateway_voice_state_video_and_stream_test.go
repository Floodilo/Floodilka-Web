/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"testing"
	"time"
)

func TestGatewayVoiceStateVideoAndStream(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	guild := createGuild(t, client, user.Token, "Video Test Guild")
	guildID := parseSnowflake(t, guild.ID)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/channels", guildID), map[string]any{
		"name": "video-channel",
		"type": 2,
	}, user.Token)
	if err != nil {
		t.Fatalf("failed to create voice channel: %v", err)
	}
	var voiceChannel minimalChannelResponse
	decodeJSONResponse(t, resp, &voiceChannel)

	gatewayClient := newGatewayClient(t, client, user.Token)
	defer gatewayClient.Close()

	var connectionID string
	var lkConn *livekitConnection

	t.Run("join with video enabled", func(t *testing.T) {
		gatewayClient.SendVoiceStateUpdate(&guild.ID, &voiceChannel.ID, nil, false, false, true, false)

		serverUpdate := gatewayClient.WaitForEvent(t, "VOICE_SERVER_UPDATE", 5*time.Second, nil)
		var vsu voiceServerUpdate
		if err := json.Unmarshal(serverUpdate.Data, &vsu); err != nil {
			t.Fatalf("failed to decode VOICE_SERVER_UPDATE: %v", err)
		}
		connectionID = vsu.ConnectionID

		roomName := guild.ID
		lkConn = connectToLiveKit(t, vsu.Endpoint, vsu.Token, roomName, user.UserID)
		defer lkConn.disconnect()

		if lkConn.getParticipantCount() < 1 {
			t.Fatal("expected at least 1 participant in LiveKit room")
		}

		t.Logf("Successfully connected to LiveKit room with video with %d participant(s)", lkConn.getParticipantCount())

		stateUpdate := gatewayClient.WaitForEvent(t, "VOICE_STATE_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var vs voiceStateUpdate
			if err := json.Unmarshal(data, &vs); err != nil {
				return false
			}
			return vs.UserID == user.UserID && vs.ConnectionID == connectionID
		})

		var vs voiceStateUpdate
		if err := json.Unmarshal(stateUpdate.Data, &vs); err != nil {
			t.Fatalf("failed to decode VOICE_STATE_UPDATE: %v", err)
		}

		if !vs.SelfVideo {
			t.Fatal("expected self_video to be true")
		}
	})

	t.Run("enable screen share stream", func(t *testing.T) {
		gatewayClient.SendVoiceStateUpdate(&guild.ID, &voiceChannel.ID, &connectionID, false, false, false, true)

		stateUpdate := gatewayClient.WaitForEvent(t, "VOICE_STATE_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
			var vs voiceStateUpdate
			if err := json.Unmarshal(data, &vs); err != nil {
				return false
			}
			return vs.UserID == user.UserID && vs.SelfStream
		})

		var vs voiceStateUpdate
		if err := json.Unmarshal(stateUpdate.Data, &vs); err != nil {
			t.Fatalf("failed to decode VOICE_STATE_UPDATE: %v", err)
		}

		if !vs.SelfStream {
			t.Fatal("expected self_stream to be true")
		}
	})
}
