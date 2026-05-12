/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"testing"
)

func extractPresencesFromReady(t testing.TB, raw json.RawMessage) []map[string]any {
	t.Helper()
	var payload struct {
		Presences []map[string]any `json:"presences"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		t.Fatalf("failed to decode READY presences: %v", err)
	}
	return payload.Presences
}
