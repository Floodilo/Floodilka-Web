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

func TestReportUser(t *testing.T) {
	client := newTestClient(t)
	reporter := createTestAccount(t, client)
	reportedUser := createTestAccount(t, client)

	t.Run("can report a user", func(t *testing.T) {
		req := map[string]any{
			"user_id":         reportedUser.UserID,
			"category":        "harassment",
			"additional_info": "This user is harassing me",
		}

		resp, err := client.postJSONWithAuth("/reports/user", req, reporter.Token)
		if err != nil {
			t.Fatalf("failed to report user: %v", err)
		}
		defer resp.Body.Close()

		assertStatus(t, resp, http.StatusOK)

		var result map[string]any
		decodeJSONResponse(t, resp, &result)

		if _, ok := result["report_id"]; !ok {
			t.Fatal("expected report_id in response")
		}
	})
}
