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
)

// verifyGuildIconInS3 checks if the guild's icon exists in S3
func verifyGuildIconInS3(t *testing.T, client *testClient, guildID string) assetVerifyResponse {
	t.Helper()
	resp, err := client.get(fmt.Sprintf("/test/verify-asset/guild/%s/icon", guildID))
	if err != nil {
		t.Fatalf("failed to verify guild icon: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)
	var result assetVerifyResponse
	decodeJSONResponse(t, resp, &result)
	return result
}
