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

func createGuildVoiceChannel(t testing.TB, client *testClient, token string, guildID int64, name string) minimalChannelResponse {
	return createGuildChannelOfType(t, client, token, guildID, name, guildChannelTypeVoice)
}
