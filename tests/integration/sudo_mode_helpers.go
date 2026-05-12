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

func assertSudoModeRequired(t testing.TB, resp *http.Response) {
	t.Helper()
	if resp.StatusCode != http.StatusForbidden {
		t.Fatalf("expected 403 for sudo mode requirement, got %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	var apiErr errorResponse
	decodeJSONResponse(t, resp, &apiErr)
	if apiErr.Code != "SUDO_MODE_REQUIRED" {
		t.Fatalf("expected SUDO_MODE_REQUIRED code, got %s", apiErr.Code)
	}
}
