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

func TestGatewayCompressionZstd(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	gc := newZstdGatewayClient(t, client, account.Token)
	t.Cleanup(gc.Close)

	gc.WaitForEvent(t, "READY", 15*time.Second, nil)

	guild := createGuild(t, client, account.Token, "zstd-compression-test")

	gc.WaitForEvent(t, "GUILD_CREATE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			return false
		}
		return payload.ID == guild.ID
	})
}
