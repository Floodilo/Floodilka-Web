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

func clearTestEmails(t testing.TB, client *testClient) {
	t.Helper()
	resp, err := client.delete("/test/emails", "")
	if err != nil {
		t.Fatalf("failed to clear test emails: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("clearing test emails returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
