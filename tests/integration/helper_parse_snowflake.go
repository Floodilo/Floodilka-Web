/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"strconv"
	"testing"
)

func parseSnowflake(t testing.TB, id string) int64 {
	t.Helper()
	value, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		t.Fatalf("failed to parse snowflake %s: %v", id, err)
	}
	return value
}
