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

func waitForMessageDeleteBulk(t testing.TB, gw interface {
	WaitForEvent(t testing.TB, eventType string, timeout time.Duration, match func(json.RawMessage) bool) gatewayDispatch
}, channelID string, messageIDs []string) {
	t.Helper()
	timeout := 10 * time.Second
	gw.WaitForEvent(t, "MESSAGE_DELETE_BULK", timeout, func(data json.RawMessage) bool {
		var del struct {
			IDs       []string `json:"ids"`
			ChannelID string   `json:"channel_id"`
		}
		if err := json.Unmarshal(data, &del); err != nil {
			return false
		}
		if del.ChannelID != channelID {
			return false
		}
		idSet := make(map[string]bool)
		for _, id := range del.IDs {
			idSet[id] = true
		}
		for _, expectedID := range messageIDs {
			if !idSet[expectedID] {
				return false
			}
		}
		return true
	})
}
