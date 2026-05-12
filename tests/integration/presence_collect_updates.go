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

func collectPresenceUpdates(t testing.TB, gw *gatewayClient, duration time.Duration) []json.RawMessage {
	t.Helper()
	var presences []json.RawMessage
	deadline := time.Now().Add(duration)
	for time.Now().Before(deadline) {
		remaining := time.Until(deadline)
		if remaining <= 0 {
			break
		}
		eventName, data := gw.NextDispatch(remaining)
		if eventName == "" {
			break
		}
		if eventName == "PRESENCE_UPDATE" || eventName == "PRESENCE_UPDATE_BULK" {
			presences = append(presences, data)
		}
	}
	return presences
}
