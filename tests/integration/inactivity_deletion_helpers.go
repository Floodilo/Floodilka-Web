/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"net/http"
	"testing"
	"time"
)

// inactivityWorkerResponse represents the response from the inactivity worker endpoint
type inactivityWorkerResponse struct {
	Processed          int    `json:"processed"`
	WarningsSent       int    `json:"warnings_sent"`
	DeletionsScheduled int    `json:"deletions_scheduled"`
	Message            string `json:"message"`
}

// setLastActiveAtRequest represents the request to set last_active_at
type setLastActiveAtRequest struct {
	Timestamp string `json:"timestamp"`
}

// setLastActiveAt sets the last_active_at timestamp for a user
func setLastActiveAt(t testing.TB, client *testClient, userID string, lastActiveAt time.Time) {
	t.Helper()

	resp, err := client.postJSON(
		fmt.Sprintf("/test/users/%s/set-last-active-at", userID),
		setLastActiveAtRequest{
			Timestamp: lastActiveAt.UTC().Format(time.RFC3339),
		},
	)
	if err != nil {
		t.Fatalf("failed to set last_active_at: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 when setting last_active_at, got %d", resp.StatusCode)
	}
}
