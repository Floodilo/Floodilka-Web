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

func TestUserAvatar_ClearAvatar(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	payload := map[string]any{
		"avatar": "data:image/png;base64," + getValidPNGBase64(),
	}
	resp, err := client.patchJSONWithAuth("/users/@me", payload, user.Token)
	if err != nil {
		t.Fatalf("failed to set avatar: %v", err)
	}
	resp.Body.Close()

	payload = map[string]any{
		"avatar": nil,
	}
	resp, err = client.patchJSONWithAuth("/users/@me", payload, user.Token)
	if err != nil {
		t.Fatalf("failed to clear avatar: %v", err)
	}
	defer resp.Body.Close()
	assertStatus(t, resp, http.StatusOK)

	var result struct {
		Avatar *string `json:"avatar"`
	}
	decodeJSONResponse(t, resp, &result)

	if result.Avatar != nil {
		t.Error("expected avatar to be cleared")
	}

	verify := verifyUserAvatarInS3(t, client, user.UserID)
	if verify.Hash != nil {
		t.Errorf("expected avatar hash to be cleared in DB, got %s", *verify.Hash)
	}
}
