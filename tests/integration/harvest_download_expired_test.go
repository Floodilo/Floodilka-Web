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

func TestHarvestDownloadExpired(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)

	harvestResp, err := client.postJSONWithAuth("/users/@me/harvest", nil, user.Token)
	if err != nil {
		t.Fatalf("failed to request data harvest: %v", err)
	}
	assertStatus(t, harvestResp, http.StatusOK)
	var harvestRequest struct {
		HarvestID string `json:"harvestId"`
	}
	decodeJSONResponse(t, harvestResp, &harvestRequest)

	waitForCondition(t, 90*time.Second, func() (bool, error) {
		status := fetchHarvestStatus(t, client, user.Token, harvestRequest.HarvestID)
		if status.CompletedAt != nil && status.DownloadURLExpiresAt != nil {
			return true, nil
		}
		if status.FailedAt != nil {
			return false, fmt.Errorf("harvest failed: %v", *status.ErrorMessage)
		}
		return false, nil
	})

	status := fetchHarvestStatus(t, client, user.Token, harvestRequest.HarvestID)
	if status.CompletedAt == nil {
		t.Fatalf("expected harvest to complete")
	}

	expiredTime := time.Now().Add(-1 * time.Hour)
	setHarvestExpiration(t, client, user.UserID, harvestRequest.HarvestID, expiredTime.Format(time.RFC3339))

	resp, err := client.getWithAuth(fmt.Sprintf("/users/@me/harvest/%s/download", harvestRequest.HarvestID), user.Token)
	if err != nil {
		t.Fatalf("failed to fetch harvest download: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", resp.StatusCode)
	}

	var errorResponse struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	}
	decodeJSONResponse(t, resp, &errorResponse)
	if errorResponse.Code != "HARVEST_EXPIRED" {
		t.Fatalf("expected error code HARVEST_EXPIRED, got %s", errorResponse.Code)
	}
}
