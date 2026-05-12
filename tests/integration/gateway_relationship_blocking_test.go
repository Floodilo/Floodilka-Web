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

func TestGatewayRelationshipBlocking(t *testing.T) {
	client := newTestClient(t)
	blocker := createTestAccount(t, client)
	blocked := createTestAccount(t, client)

	blockerSocket := newGatewayClient(t, client, blocker.Token)
	t.Cleanup(blockerSocket.Close)
	blockedSocket := newGatewayClient(t, client, blocked.Token)
	t.Cleanup(blockedSocket.Close)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", blocked.UserID), nil, blocker.Token)
	if err != nil {
		t.Fatalf("failed to send friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	blockerSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode blocker friend request: %v", err)
		}
		return payload.ID == blocked.UserID && payload.Type == relationshipOutgoing
	})

	blockedSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode blocked friend request: %v", err)
		}
		return payload.ID == blocker.UserID && payload.Type == relationshipIncoming
	})

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", blocker.UserID), nil, blocked.Token)
	if err != nil {
		t.Fatalf("failed to accept friend request: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	blockerSocket.WaitForEvent(t, "RELATIONSHIP_UPDATE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode blocker friendship: %v", err)
		}
		return payload.ID == blocked.UserID && payload.Type == relationshipFriend
	})

	blockedSocket.WaitForEvent(t, "RELATIONSHIP_UPDATE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode blocked friendship: %v", err)
		}
		return payload.ID == blocker.UserID && payload.Type == relationshipFriend
	})

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/users/@me/relationships/%s", blocked.UserID), map[string]int{"type": relationshipBlocked}, blocker.Token)
	if err != nil {
		t.Fatalf("failed to block user: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	blockerSocket.WaitForEvent(t, "RELATIONSHIP_ADD", 30*time.Second, func(raw json.RawMessage) bool {
		var payload relationshipResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode blocker relationship add: %v", err)
		}
		return payload.ID == blocked.UserID && payload.Type == relationshipBlocked
	})

	blockedSocket.WaitForEvent(t, "RELATIONSHIP_REMOVE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode blocked relationship remove: %v", err)
		}
		return payload.ID == blocker.UserID
	})

	resp, err = client.delete(fmt.Sprintf("/users/@me/relationships/%s", blocked.UserID), blocker.Token)
	if err != nil {
		t.Fatalf("failed to unblock user: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	blockerSocket.WaitForEvent(t, "RELATIONSHIP_REMOVE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID string `json:"id"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode unblock relationship remove: %v", err)
		}
		return payload.ID == blocked.UserID
	})
}
