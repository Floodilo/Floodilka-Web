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

func TestRelationshipAcceptAfterPrivacyChangeAllowsExistingRequest(t *testing.T) {
	client := newTestClient(t)
	alice := createTestAccount(t, client)
	bob := createTestAccount(t, client)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", bob.UserID), nil, alice.Token)
	if err != nil {
		t.Fatalf("failed to send friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.patchJSONWithAuth("/users/@me/settings", map[string]int{"friend_source_flags": 3}, bob.Token)
	if err != nil {
		t.Fatalf("failed to update friend_source_flags: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", alice.UserID), nil, bob.Token)
	if err != nil {
		t.Fatalf("failed to accept friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var accepted relationshipResponse
	decodeJSONResponse(t, resp, &accepted)
	if accepted.ID != alice.UserID || accepted.Type != relationshipFriend {
		t.Fatalf("expected bob to have friend relationship with alice after acceptance")
	}

	resp, err = client.getWithAuth("/users/@me/relationships", alice.Token)
	if err != nil {
		t.Fatalf("failed to list alice relationships: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var aliceRels []relationshipResponse
	decodeJSONResponse(t, resp, &aliceRels)
	if len(aliceRels) != 1 || aliceRels[0].ID != bob.UserID || aliceRels[0].Type != relationshipFriend {
		t.Fatalf("expected alice to have a friendship with bob after acceptance")
	}
}
