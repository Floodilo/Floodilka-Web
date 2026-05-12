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

func TestHarvestDownloadNotExpired(t *testing.T) {
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

	validTime := time.Now().Add(6 * 24 * time.Hour)
	setHarvestExpiration(t, client, user.UserID, harvestRequest.HarvestID, validTime.Format(time.RFC3339))

	resp, err := client.getWithAuth(fmt.Sprintf("/users/@me/harvest/%s/download", harvestRequest.HarvestID), user.Token)
	if err != nil {
		t.Fatalf("failed to fetch harvest download: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var download harvestDownloadResponse
	decodeJSONResponse(t, resp, &download)
	if download.DownloadURL == "" {
		t.Fatalf("expected download url in harvest response")
	}
	if download.ExpiresAt == "" {
		t.Fatalf("expected expires_at in harvest response")
	}
}
