/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

// TestMultipleAssetUpdates_Consistency verifies consistency across multiple rapid updates
func TestMultipleAssetUpdates_Consistency(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	ensureSessionStarted(t, client, user.Token)

	for i := range 3 {
		pngDataURL := "data:image/png;base64," + getValidPNGBase64()
		resp, err := client.patchJSONWithAuth("/users/@me", map[string]any{
			"avatar": pngDataURL,
		}, user.Token)
		if err != nil {
			t.Fatalf("failed to upload avatar iteration %d: %v", i, err)
		}

		var result struct {
			Avatar string `json:"avatar"`
		}
		decodeJSONResponse(t, resp, &result)
		resp.Body.Close()

		verify := verifyUserAvatarInS3(t, client, user.UserID)
		if verify.Hash == nil || *verify.Hash != result.Avatar {
			t.Errorf("iteration %d: hash mismatch between API response and DB", i)
		}
		if verify.ExistsInS3 == nil || !*verify.ExistsInS3 {
			t.Errorf("iteration %d: avatar not found in S3 after successful update", i)
		}
	}
}
