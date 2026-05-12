/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

// Helper function to find CALL message in channel
func findCallMessage(t *testing.T, client *testClient, token string, channelID int64) *callMessageResponse {
	t.Helper()

	messages := getChannelMessages(t, client, token, channelID, 50)
	for _, msg := range messages {
		if msg.Type == 3 {
			return &msg
		}
	}
	return nil
}
