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

func TestGatewayUserUpdateDispatch(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	socket := newGatewayClient(t, client, account.Token)
	t.Cleanup(socket.Close)

	newGlobal := fmt.Sprintf("Gateway User %d", time.Now().UnixNano())
	newBio := fmt.Sprintf("Gateway Bio %d", time.Now().UnixNano())
	resp, err := client.patchJSONWithAuth("/users/@me", map[string]any{
		"global_name": newGlobal,
		"bio":         newBio,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to update profile: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	socket.WaitForEvent(t, "USER_UPDATE", 30*time.Second, func(raw json.RawMessage) bool {
		var payload userPrivateResponse
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("failed to decode user update payload: %v", err)
		}
		return payload.GlobalName == newGlobal && payload.Bio == newBio
	})
}
