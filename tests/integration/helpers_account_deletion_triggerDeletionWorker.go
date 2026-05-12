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

// triggerDeletionWorker manually triggers the deletion worker processing
func triggerDeletionWorker(t testing.TB, client *testClient) {
	resp, err := client.postJSON("/test/worker/process-pending-deletions", nil)
	if err != nil {
		t.Fatalf("failed to trigger deletion worker: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	var result struct {
		Scheduled int `json:"scheduled"`
	}
	decodeJSONResponse(t, resp, &result)

	t.Logf("Triggered deletion worker, scheduled %d jobs", result.Scheduled)
}
