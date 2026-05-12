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

// grantGuildBannerFeature is a convenience function to grant banner upload capability.
func grantGuildBannerFeature(t testing.TB, client *testClient, guildID string) {
	t.Helper()
	grantGuildFeatures(t, client, guildID, []string{GuildFeatureBanner})
}
