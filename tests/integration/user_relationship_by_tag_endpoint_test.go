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

func TestUserRelationshipByTagEndpoint(t *testing.T) {
	client := newTestClient(t)
	requester := createTestAccount(t, client)
	target := createTestAccount(t, client)

	resp, err := client.getWithAuth("/users/@me", target.Token)
	if err != nil {
		t.Fatalf("failed to fetch target profile: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var targetProfile userPrivateResponse
	decodeJSONResponse(t, resp, &targetProfile)

	payload := map[string]string{
		"username":      targetProfile.Username,
		"discriminator": targetProfile.Discriminator,
	}
	resp, err = client.postJSONWithAuth("/users/@me/relationships", payload, requester.Token)
	if err != nil {
		t.Fatalf("failed to send friend request by tag: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var rel relationshipResponse
	decodeJSONResponse(t, resp, &rel)
	if rel.User.ID != target.UserID || rel.Type != relationshipOutgoing {
		t.Fatalf("expected outgoing relationship for %s, got %+v", target.UserID, rel)
	}
}
