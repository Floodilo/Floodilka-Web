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

func TestUserNoteLifecycle(t *testing.T) {
	client := newTestClient(t)
	user := createTestAccount(t, client)
	target := createTestAccount(t, client)

	socket := newGatewayClient(t, client, user.Token)
	defer socket.Close()

	noteContent := "This is a test note"
	notePayload := map[string]string{
		"note": noteContent,
	}

	resp, err := client.putJSONWithAuth(fmt.Sprintf("/users/@me/notes/%s", target.UserID), notePayload, user.Token)
	if err != nil {
		t.Fatalf("failed to set user note: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	// Verify USER_NOTE_UPDATE event
	socket.WaitForEvent(t, "USER_NOTE_UPDATE", 10*time.Second, func(raw json.RawMessage) bool {
		var payload struct {
			ID   string `json:"id"`
			Note string `json:"note"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			return false
		}
		return payload.ID == target.UserID && payload.Note == noteContent
	})

	resp, err = client.getWithAuth(fmt.Sprintf("/users/@me/notes/%s", target.UserID), user.Token)
	if err == nil && resp.StatusCode == http.StatusOK {
		var noteResp struct {
			Note string `json:"note"`
		}
		decodeJSONResponse(t, resp, &noteResp)
		if noteResp.Note != noteContent {
			t.Fatalf("expected note %q, got %q", noteContent, noteResp.Note)
		}
	} else if resp != nil {
		resp.Body.Close()
	}
}
