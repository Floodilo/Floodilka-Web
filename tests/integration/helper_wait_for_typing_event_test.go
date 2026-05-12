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

func waitForTypingEvent(t testing.TB, gw interface {
	WaitForEvent(t testing.TB, eventType string, timeout time.Duration, match func(json.RawMessage) bool) gatewayDispatch
}, channelID, userID string) {
	t.Helper()
	timeout := 10 * time.Second
	gw.WaitForEvent(t, "TYPING_START", timeout, func(data json.RawMessage) bool {
		var typing struct {
			ChannelID string `json:"channel_id"`
			UserID    string `json:"user_id"`
		}
		if err := json.Unmarshal(data, &typing); err != nil {
			return false
		}
		return typing.ChannelID == channelID && typing.UserID == userID
	})
}
