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

// TestGuildSplashUpload_DBAndS3Consistency verifies guild splash upload consistency
func TestGuildSplashUpload_DBAndS3Consistency(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	guild := createGuild(t, client, user.Token, "Splash Test Guild")
	guildID := guild.ID

	grantGuildFeatures(t, client, guildID, []string{"INVITE_SPLASH"})

	pngDataURL := "data:image/png;base64," + getValidPNGBase64()
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%s", guildID), map[string]any{
		"splash": pngDataURL,
	}, user.Token)
	if err != nil {
		t.Fatalf("failed to upload guild splash: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Splash string `json:"splash"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Splash == "" {
		t.Fatal("expected splash hash to be set after upload")
	}

	verify := verifyGuildSplashInS3(t, client, guildID)
	if verify.Hash == nil {
		t.Fatal("expected hash to be set in verification response")
	}
	if *verify.Hash != result.Splash {
		t.Errorf("hash mismatch: API returned %s, verification returned %s", result.Splash, *verify.Hash)
	}
	if verify.ExistsInS3 == nil || !*verify.ExistsInS3 {
		t.Error("splash hash exists in DB but asset NOT found in S3 - data inconsistency!")
	}
}
