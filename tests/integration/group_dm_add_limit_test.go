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

const (
	maxGroupDmLimit     = 150
	maxGroupDmErrorCode = "MAX_GROUP_DMS"
)

func TestGroupDmRecipientLimit(t *testing.T) {
	client := newTestClient(t)
	creator := createTestAccount(t, client)
	target := createTestAccount(t, client)
	recipient := createTestAccount(t, client)
	helper := createTestAccount(t, client)

	createFriendship(t, client, creator, target)
	createFriendship(t, client, creator, recipient)

	payload := map[string]any{
		"group_dm_count": maxGroupDmLimit,
		"recipients":     []string{helper.UserID, recipient.UserID},
		"clear_existing": true,
	}
	seedResult := seedPrivateChannels(t, client, target, payload)
	if len(seedResult.GroupDMs) != maxGroupDmLimit {
		t.Fatalf("expected %d seeded group DMs, got %d", maxGroupDmLimit, len(seedResult.GroupDMs))
	}

	requestPayload := map[string]any{
		"recipients": []string{helper.UserID, target.UserID},
	}
	resp, err := client.postJSONWithAuth("/users/@me/channels", requestPayload, creator.Token)
	if err != nil {
		t.Fatalf("failed to add recipient: %v", err)
	}

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected status %d when limit reached, got %d", http.StatusBadRequest, resp.StatusCode)
	}

	var errorBody struct {
		Code string `json:"code"`
	}
	decodeJSONResponse(t, resp, &errorBody)
	if errorBody.Code != maxGroupDmErrorCode {
		t.Fatalf("expected error code %s, got %s", maxGroupDmErrorCode, errorBody.Code)
	}
}
