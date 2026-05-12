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

// TestGuildMemberAvatarUpload_DBAndS3Consistency verifies guild member avatar upload
func TestGuildMemberAvatarUpload_DBAndS3Consistency(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	grantPremium(t, client, user.UserID, PremiumTypeSubscription)

	guild := createGuild(t, client, user.Token, "Member Avatar Test Guild")
	guildID := guild.ID

	pngDataURL := "data:image/png;base64," + getValidPNGBase64()
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/guilds/%s/members/@me", guildID), map[string]any{
		"avatar": pngDataURL,
	}, user.Token)
	if err != nil {
		t.Fatalf("failed to upload guild member avatar: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Avatar string `json:"avatar"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Avatar == "" {
		t.Fatal("expected guild member avatar hash to be set after upload")
	}

	verify := verifyGuildMemberAvatarInS3(t, client, guildID, user.UserID)
	if verify.Hash == nil {
		t.Fatal("expected hash to be set in verification response")
	}
	if *verify.Hash != result.Avatar {
		t.Errorf("hash mismatch: API returned %s, verification returned %s", result.Avatar, *verify.Hash)
	}
	if verify.ExistsInS3 == nil || !*verify.ExistsInS3 {
		t.Error("guild member avatar hash exists in DB but asset NOT found in S3 - data inconsistency!")
	}
}
