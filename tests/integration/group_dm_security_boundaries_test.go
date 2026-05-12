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

// TestGroupDMSecurityBoundaries tests group DM privacy
func TestGroupDMSecurityBoundaries(t *testing.T) {
	client := newTestClient(t)
	creator := createTestAccount(t, client)
	recipient := createTestAccount(t, client)
	attacker := createTestAccount(t, client)

	createFriendship(t, client, creator, recipient)

	groupDMPayload := map[string]any{
		"recipients": []string{recipient.UserID},
	}
	resp, err := client.postJSONWithAuth("/users/@me/channels", groupDMPayload, creator.Token)
	if err != nil {
		t.Fatalf("failed to create group DM: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var groupDM struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &groupDM)

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%s/messages?limit=10", groupDM.ID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt group DM access: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized group DM access, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuth(fmt.Sprintf("/channels/%s/messages", groupDM.ID), map[string]string{"content": "attacker message"}, attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt group DM message: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized group DM message, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.putWithAuth(fmt.Sprintf("/channels/%s/recipients/%s", groupDM.ID, attacker.UserID), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt add self to group DM: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for unauthorized group DM join, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/channels/%s/recipients/%s", groupDM.ID, recipient.UserID), recipient.Token)
	if err != nil {
		t.Fatalf("failed to leave group DM: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%s/messages?limit=10", groupDM.ID), recipient.Token)
	if err != nil {
		t.Fatalf("failed to check group DM after leave: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 after leaving group DM, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
