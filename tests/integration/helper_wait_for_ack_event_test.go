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

func waitForAckEvent(t testing.TB, gw interface {
	WaitForEvent(t testing.TB, eventType string, timeout time.Duration, match func(json.RawMessage) bool) gatewayDispatch
}, channelID, messageID string) {
	t.Helper()
	timeout := 10 * time.Second
	gw.WaitForEvent(t, "MESSAGE_ACK", timeout, func(data json.RawMessage) bool {
		var ack struct {
			ChannelID string `json:"channel_id"`
			MessageID string `json:"message_id"`
		}
		if err := json.Unmarshal(data, &ack); err != nil {
			return false
		}
		return ack.ChannelID == channelID && ack.MessageID == messageID
	})
}
