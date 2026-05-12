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
	"time"
)

func waitForEmail(t testing.TB, client *testClient, emailType, to string) testEmail {
	t.Helper()
	timeout := time.After(30 * time.Second)
	ticker := time.NewTicker(200 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-timeout:
			t.Fatalf("timed out waiting for email type %s to %s", emailType, to)
		case <-ticker.C:
			resp, err := client.get("/test/emails")
			if err != nil {
				continue
			}
			if resp.StatusCode != http.StatusOK {
				resp.Body.Close()
				continue
			}
			var payload testEmailListResponse
			decodeJSONResponse(t, resp, &payload)
			for _, email := range payload.Emails {
				if email.Type == emailType && (to == "" || email.To == to) {
					return email
				}
			}
		}
	}
}
