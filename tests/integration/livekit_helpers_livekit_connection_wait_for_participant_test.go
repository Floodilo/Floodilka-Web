/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"time"
)

// waitForParticipant waits for a participant with the given identity to join the room
func (lk *livekitConnection) waitForParticipant(identity string, timeout time.Duration) bool {
	lk.t.Helper()

	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		participants := lk.room.GetRemoteParticipants()
		for _, p := range participants {
			if p.Identity() == identity {
				lk.t.Logf("Found participant: %s", identity)
				return true
			}
		}
		time.Sleep(100 * time.Millisecond)
	}

	lk.t.Logf("Did not find participant '%s' after %v. Current participants:", identity, timeout)
	participants := lk.room.GetRemoteParticipants()
	for _, p := range participants {
		lk.t.Logf("  - %s", p.Identity())
	}

	return false
}
