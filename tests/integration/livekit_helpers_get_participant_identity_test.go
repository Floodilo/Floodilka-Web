/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

// getParticipantIdentity constructs the LiveKit participant identity
// This must match the format used in LiveKitService.ts: user_${userId}_${connectionId}
func getParticipantIdentity(userID, connectionID string) string {
	return "user_" + userID + "_" + connectionID
}
