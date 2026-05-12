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

// ListUserGifts fetches the authenticated user's gift codes.
func ListUserGifts(t testing.TB, client *testClient, token string) []GiftCodeMetadataResponse {
	t.Helper()
	resp, err := client.getWithAuth("/users/@me/gifts", token)
	if err != nil {
		t.Fatalf("failed to list user gifts: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var gifts []GiftCodeMetadataResponse
	decodeJSONResponse(t, resp, &gifts)
	return gifts
}
