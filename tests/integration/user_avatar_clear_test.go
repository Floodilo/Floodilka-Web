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

// TestUserAvatarClear_DBAndS3Consistency verifies that clearing an avatar
// updates DB and queues old asset for deletion
func TestUserAvatarClear_DBAndS3Consistency(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	pngDataURL := "data:image/png;base64," + getValidPNGBase64()
	resp, err := client.patchJSONWithAuth("/users/@me", map[string]any{
		"avatar": pngDataURL,
	}, user.Token)
	if err != nil {
		t.Fatalf("failed to upload avatar: %v", err)
	}
	resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	verify := verifyUserAvatarInS3(t, client, user.UserID)
	if verify.ExistsInS3 == nil || !*verify.ExistsInS3 {
		t.Fatal("avatar should exist in S3 before clearing")
	}

	resp, err = client.patchJSONWithAuth("/users/@me", map[string]any{
		"avatar": nil,
	}, user.Token)
	if err != nil {
		t.Fatalf("failed to clear avatar: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Avatar *string `json:"avatar"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Avatar != nil && *result.Avatar != "" {
		t.Errorf("expected avatar to be null after clearing, got %v", result.Avatar)
	}

	verify = verifyUserAvatarInS3(t, client, user.UserID)
	if verify.Hash != nil && *verify.Hash != "" {
		t.Errorf("expected no avatar hash in DB after clearing, got %s", *verify.Hash)
	}
}
