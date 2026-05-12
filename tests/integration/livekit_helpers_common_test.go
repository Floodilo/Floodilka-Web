/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	lksdk "github.com/livekit/server-sdk-go/v2"
	"testing"
)

// livekitConnection wraps a LiveKit room connection
type livekitConnection struct {
	room *lksdk.Room
	t    testing.TB
}
