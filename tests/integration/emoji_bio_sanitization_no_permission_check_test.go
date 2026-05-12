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

func TestEmoji_BioSanitization_NoPermissionCheck(t *testing.T) {

	client := newTestClient(t)
	premiumUser := createTestAccount(t, client)
	ensureSessionStarted(t, client, premiumUser.Token)
	grantPremium(t, client, premiumUser.UserID, PremiumTypeSubscription)

	t.Run("no permission check for bio emojis", func(t *testing.T) {

		payload := map[string]any{
			"bio": "No permission needed <:test:123456789012345678>",
		}

		resp, err := client.patchJSONWithAuth("/users/@me", payload, premiumUser.Token)
		if err != nil {
			t.Fatalf("failed to update profile: %v", err)
		}
		defer resp.Body.Close()
		assertStatus(t, resp, http.StatusOK)

		t.Log("Bio emoji update succeeded - no permission check required")
	})
}
