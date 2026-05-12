/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

// waitForDeletionCompletion waits for deletion to complete with exponential backoff
func waitForDeletionCompletion(t testing.TB, client *testClient, userID string, timeout time.Duration) {
	backoff := 100 * time.Millisecond
	maxBackoff := 5 * time.Second
	start := time.Now()

	for time.Since(start) < timeout {
		time.Sleep(backoff)

		resp, err := client.get(fmt.Sprintf("/test/users/%s/data-exists", userID))
		if err != nil {
			t.Logf("Error checking deletion status: %v", err)
			continue
		}

		if resp.StatusCode == http.StatusOK {
			var data userDataExistsResponse
			if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
				resp.Body.Close()
				t.Logf("Error decoding response: %v", err)
				continue
			}
			resp.Body.Close()

			if data.UserExists && data.HasDeletedFlag {
				t.Log("Deletion completed successfully")
				return
			}
		} else {
			resp.Body.Close()
		}

		backoff = time.Duration(float64(backoff) * 1.5)
		if backoff > maxBackoff {
			backoff = maxBackoff
		}
	}

	t.Fatal("Deletion did not complete within timeout")
}
