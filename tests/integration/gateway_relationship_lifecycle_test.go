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

func TestGatewayRelationshipLifecycle(t *testing.T) {
	client := newTestClient(t)
	requester := createTestAccount(t, client)
	target := createTestAccount(t, client)

	requesterSocket := newGatewayClient(t, client, requester.Token)
	t.Cleanup(requesterSocket.Close)
	targetSocket := newGatewayClient(t, client, target.Token)
	t.Cleanup(targetSocket.Close)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", target.UserID), nil, requester.Token)
	if err != nil {
		t.Fatalf("failed to send friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	requesterSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode requester relationship add: %v", err)
		}
		return payload.ID == target.UserID && payload.Type == relationshipOutgoing
	})

	targetSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode target relationship add: %v", err)
		}
		return payload.ID == requester.UserID && payload.Type == relationshipIncoming
	})

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", requester.UserID), nil, target.Token)
	if err != nil {
		t.Fatalf("failed to accept friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	requesterSocket.WaitForEvent(t, "RELATIONSHIP_UPDATE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode requester relationship update: %v", err)
		}
		return payload.ID == target.UserID && payload.Type == relationshipFriend
	})

	targetSocket.WaitForEvent(t, "RELATIONSHIP_UPDATE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode target relationship update: %v", err)
		}
		return payload.ID == requester.UserID && payload.Type == relationshipFriend
	})

	resp, err = client.delete(fmt.Sprintf("/users/@me/relationships/%s", target.UserID), requester.Token)
	if err != nil {
		t.Fatalf("failed to remove friend: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	requesterSocket.WaitForEvent(t, "RELATIONSHIP_REMOVE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode requester relationship remove: %v", err)
		}
		return payload.ID == target.UserID
	})

	targetSocket.WaitForEvent(t, "RELATIONSHIP_REMOVE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode target relationship remove: %v", err)
		}
		return payload.ID == requester.UserID
	})
}
