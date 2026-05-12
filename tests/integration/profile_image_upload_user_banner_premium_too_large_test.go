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

func TestUserBanner_Premium_TooLarge(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	grantSubscriptionPremium(t, client, user.UserID)

	payload := map[string]any{
		"banner": "data:image/png;base64," + getLargeBase64(AvatarMaxSize+10000),
	}

	resp, err := client.patchJSONWithAuth("/users/@me", payload, user.Token)
	if err != nil {
		t.Fatalf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		t.Error("expected request to fail for banner over size limit")
	}
}
