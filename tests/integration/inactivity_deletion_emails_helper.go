/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"net/http"
	"testing"
)

// getTestEmails retrieves all test emails that have been sent
func getTestEmails(t testing.TB, client *testClient) []testEmail {
	t.Helper()

	resp, err := client.get("/test/emails")
	if err != nil {
		t.Fatalf("failed to get test emails: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200 when getting emails, got %d", resp.StatusCode)
	}

	var result testEmailListResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("failed to decode email response: %v", err)
	}

	return result.Emails
}
