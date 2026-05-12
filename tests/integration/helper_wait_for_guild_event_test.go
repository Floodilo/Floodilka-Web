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

func waitForGuildEvent(t testing.TB, gw interface {
	WaitForEvent(t testing.TB, eventType string, timeout time.Duration, match func(json.RawMessage) bool) gatewayDispatch
}, eventType, guildID string) {
	t.Helper()
	timeout := 10 * time.Second
	gw.WaitForEvent(t, eventType, timeout, func(data json.RawMessage) bool {
		var guild struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(data, &guild); err != nil {
			return false
		}
		return guild.ID == guildID
	})
}
