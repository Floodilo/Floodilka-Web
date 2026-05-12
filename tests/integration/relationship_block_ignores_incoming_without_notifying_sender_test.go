/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"
)

func TestRelationshipBlockIgnoresIncomingWithoutNotifyingSender(t *testing.T) {
	client := newTestClient(t)
	alice := createTestAccount(t, client)
	bob := createTestAccount(t, client)

	aliceSocket := newGatewayClient(t, client, alice.Token)
	t.Cleanup(aliceSocket.Close)
	bobSocket := newGatewayClient(t, client, bob.Token)
	t.Cleanup(bobSocket.Close)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", bob.UserID), nil, alice.Token)
	if err != nil {
		t.Fatalf("failed to send friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	aliceSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode relationship add: %v", err)
		}
		return payload.ID == bob.UserID && payload.Type == relationshipOutgoing
	})
	bobSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode relationship add: %v", err)
		}
		return payload.ID == alice.UserID && payload.Type == relationshipIncoming
	})

	resp, err = client.putJSONWithAuth(
		fmt.Sprintf("/users/@me/relationships/%s", alice.UserID),
		map[string]int{"type": relationshipBlocked},
		bob.Token,
	)
	if err != nil {
		t.Fatalf("failed to block user: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	bobSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode relationship add: %v", err)
		}
		return payload.ID == alice.UserID && payload.Type == relationshipBlocked
	})

	aliceSocket.AssertNoEvent(t, "RELATIONSHIP_REMOVE", 2*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode relationship remove: %v", err)
		}
		return payload.ID == bob.UserID
	})

	resp, err = client.getWithAuth("/users/@me/relationships", bob.Token)
	if err != nil {
		t.Fatalf("failed to list bob relationships: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var bobRels []relationshipResponse
	decodeJSONResponse(t, resp, &bobRels)
	if len(bobRels) != 1 || bobRels[0].ID != alice.UserID || bobRels[0].Type != relationshipBlocked {
		t.Fatalf("expected bob to have blocked alice")
	}

	resp, err = client.getWithAuth("/users/@me/relationships", alice.Token)
	if err != nil {
		t.Fatalf("failed to list alice relationships: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var aliceRels []relationshipResponse
	decodeJSONResponse(t, resp, &aliceRels)
	if len(aliceRels) != 1 || aliceRels[0].ID != bob.UserID || aliceRels[0].Type != relationshipOutgoing {
		t.Fatalf("expected alice to still have an outgoing request to bob")
	}
}
