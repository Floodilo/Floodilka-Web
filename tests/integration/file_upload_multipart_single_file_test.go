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

// TestFileUpload_Multipart_SingleFile tests multipart form-data upload with a single file
func TestFileUpload_Multipart_SingleFile(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Multipart Upload Test Guild")
	channelID := parseSnowflake(t, guild.SystemChannel)

	_, _ = sendChannelMessageWithAttachment(t, client, user.Token, channelID, "Multipart upload test", "yeah.png")

}
