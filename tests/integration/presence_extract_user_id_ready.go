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

func extractUserIDFromReady(t testing.TB, raw json.RawMessage) string {
	t.Helper()
	var payload struct {
		User struct {
			ID string `json:"id"`
		} `json:"user"`
	}
	if err := json.Unmarshal(raw, &payload); err != nil {
		t.Fatalf("failed to decode READY: %v", err)
	}
	return payload.User.ID
}
