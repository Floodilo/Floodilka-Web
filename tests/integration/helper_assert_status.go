/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

func assertStatus(t testing.TB, resp *http.Response, expectedStatus ...int) {
	t.Helper()
	accepted := expectedStatus
	if len(accepted) == 0 {
		accepted = []int{http.StatusOK}
	}
	for _, status := range accepted {
		if resp.StatusCode == status {
			return
		}
	}

	body := readResponseBody(resp)
	t.Fatalf("expected status %v, got %d: %s", accepted, resp.StatusCode, body)
}
