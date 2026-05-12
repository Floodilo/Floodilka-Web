/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
)

// matchPresenceStatus returns a function that matches presence updates for a specific user
// with a specific status, but only for global presence (not guild-specific).
func matchPresenceStatus(expectedUserID, expectedStatus string) func(json.RawMessage) bool {
	return func(raw json.RawMessage) bool {
		payload, ok := parsePresencePayload(raw, expectedUserID, expectedStatus)
		if !ok {
			return false
		}
		if _, hasGuild := payload["guild_id"]; hasGuild {
			return false
		}
		return true
	}
}

// matchPresenceStatusAnyScope matches a presence update regardless of whether it's global
// or tied to a guild.
func matchPresenceStatusAnyScope(expectedUserID, expectedStatus string) func(json.RawMessage) bool {
	return func(raw json.RawMessage) bool {
		_, ok := parsePresencePayload(raw, expectedUserID, expectedStatus)
		return ok
	}
}

func parsePresencePayload(raw json.RawMessage, expectedUserID, expectedStatus string) (map[string]any, bool) {
	var payload map[string]any
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, false
	}
	user, ok := payload["user"].(map[string]any)
	if !ok {
		return nil, false
	}
	id, ok := user["id"].(string)
	if !ok || id != expectedUserID {
		return nil, false
	}
	status, ok := payload["status"].(string)
	if !ok || status != expectedStatus {
		return nil, false
	}
	return payload, true
}
