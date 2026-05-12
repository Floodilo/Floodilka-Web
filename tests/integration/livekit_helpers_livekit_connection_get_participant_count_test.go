/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// getParticipantCount returns the number of participants in the room (including local)
func (lk *livekitConnection) getParticipantCount() int {
	return len(lk.room.GetRemoteParticipants()) + 1
}
