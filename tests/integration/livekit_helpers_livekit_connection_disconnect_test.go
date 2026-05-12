/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// disconnect disconnects from the LiveKit room
func (lk *livekitConnection) disconnect() {
	lk.t.Helper()
	if lk.room != nil {
		lk.room.Disconnect()
		lk.t.Logf("Disconnected from LiveKit room")
	}
}
