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

// triggerInactivityWorker triggers the inactivity deletion worker
func triggerInactivityWorker(t testing.TB, client *testClient) inactivityWorkerResponse {
	t.Helper()

	resp, err := client.postJSON("/test/worker/process-inactivity-deletions", nil)
	if err != nil {
		t.Fatalf("failed to trigger inactivity worker: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 when triggering inactivity worker, got %d", resp.StatusCode)
	}

	var result inactivityWorkerResponse
	decodeJSONResponse(t, resp, &result)

	t.Logf("Inactivity worker result: processed=%d, warnings_sent=%d, deletions_scheduled=%d",
		result.Processed, result.WarningsSent, result.DeletionsScheduled)

	return result
}
