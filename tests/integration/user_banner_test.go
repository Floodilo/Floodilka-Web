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

// TestUserBannerUpload_DBAndS3Consistency verifies user banner upload (premium required)
func TestUserBannerUpload_DBAndS3Consistency(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	grantPremium(t, client, user.UserID, PremiumTypeSubscription)

	pngDataURL := "data:image/png;base64," + getValidPNGBase64()
	resp, err := client.patchJSONWithAuth("/users/@me", map[string]any{
		"banner": pngDataURL,
	}, user.Token)
	if err != nil {
		t.Fatalf("failed to upload user banner: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Banner string `json:"banner"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Banner == "" {
		t.Fatal("expected banner hash to be set after upload")
	}

	verify := verifyUserBannerInS3(t, client, user.UserID)
	if verify.Hash == nil {
		t.Fatal("expected hash to be set in verification response")
	}
	if *verify.Hash != result.Banner {
		t.Errorf("hash mismatch: API returned %s, verification returned %s", result.Banner, *verify.Hash)
	}
	if verify.ExistsInS3 == nil || !*verify.ExistsInS3 {
		t.Error("banner hash exists in DB but asset NOT found in S3 - data inconsistency!")
	}
}
