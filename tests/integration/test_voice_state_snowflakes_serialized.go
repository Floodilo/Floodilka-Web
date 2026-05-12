/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"strings"
	"testing"
	"time"
)

// TestVoiceStateSnowflakesSerialized verifies that snowflakes in voice state updates are strings
func TestVoiceStateSnowflakesSerialized(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	dm := createDmChannel(t, client, user1.Token, parseSnowflake(t, user2.UserID))

	gateway1 := newGatewayClient(t, client, user1.Token)
	defer gateway1.Close()

	gateway1.SendVoiceStateUpdate(nil, &dm.ID, nil, false, false, false, false)

	vsuEvent := gateway1.WaitForEvent(t, "VOICE_STATE_UPDATE", 5*time.Second, func(data json.RawMessage) bool {
		var vsu voiceStateUpdate
		if err := json.Unmarshal(data, &vsu); err != nil {
			return false
		}
		return vsu.ChannelID != nil && *vsu.ChannelID == dm.ID
	})

	rawJSON := string(vsuEvent.Data)

	if !strings.Contains(rawJSON, `"user_id":"`) {
		if strings.Contains(rawJSON, `"user_id":`) && !strings.Contains(rawJSON, `"user_id":"`) {
			t.Errorf("user_id is serialized as a number, should be a string. Raw: %s", rawJSON)
		}
	}

	if strings.Contains(rawJSON, `"channel_id":`) && !strings.Contains(rawJSON, `"channel_id":null`) {
		if !strings.Contains(rawJSON, `"channel_id":"`) {
			t.Errorf("channel_id is serialized as a number, should be a string. Raw: %s", rawJSON)
		}
	}

	// Decode and verify
	var vsu voiceStateUpdate
	if err := json.Unmarshal(vsuEvent.Data, &vsu); err != nil {
		t.Fatalf("failed to decode VOICE_STATE_UPDATE: %v", err)
	}

	if vsu.UserID == "" {
		t.Error("user_id is empty after decoding - likely serialized as wrong type")
	}

	t.Logf("Voice state snowflake serialization test passed. user_id=%s, channel_id=%v",
		vsu.UserID, vsu.ChannelID)
}
