/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
)

// Helper function to get call eligibility
func getCallEligibility(t *testing.T, client *testClient, token string, channelID int64) callEligibilityResponse {
	t.Helper()

	resp, err := client.getWithAuth(fmt.Sprintf("/channels/%d/call", channelID), token)
	if err != nil {
		t.Fatalf("failed to get call eligibility: %v", err)
	}

	var result callEligibilityResponse
	decodeJSONResponse(t, resp, &result)
	return result
}
