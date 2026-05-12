/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"math/big"
	"net/http"
	"testing"
)

// TestRoleUpdateIgnoresUnknownPermissionBits verifies that updating a role with unknown
// permission bits succeeds and the unknown bits are stripped from the result.
func TestRoleUpdateIgnoresUnknownPermissionBits(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, "Unknown Bits Role Update Guild")
	guildID := parseSnowflake(t, guild.ID)

	createPayload := map[string]any{
		"name":        "Role To Update",
		"permissions": "0",
	}

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", guildID), createPayload, owner.Token)
	if err != nil {
		t.Fatalf("failed to create role: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var role struct {
		ID          string `json:"id"`
		Name        string `json:"name"`
		Permissions string `json:"permissions"`
	}
	decodeJSONResponse(t, resp, &role)

	sendMessages := new(big.Int).Lsh(big.NewInt(1), 11)
	unknownBit := new(big.Int).Lsh(big.NewInt(1), 60)
	combinedPerms := new(big.Int).Or(sendMessages, unknownBit)

	updatePayload := map[string]any{
		"permissions": combinedPerms.String(),
	}

	resp, err = client.patchJSONWithAuth(fmt.Sprintf("/guilds/%d/roles/%s", guildID, role.ID), updatePayload, owner.Token)
	if err != nil {
		t.Fatalf("failed to update role: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var updatedRole struct {
		ID          string `json:"id"`
		Permissions string `json:"permissions"`
	}
	decodeJSONResponse(t, resp, &updatedRole)

	returnedPerms, ok := new(big.Int).SetString(updatedRole.Permissions, 10)
	if !ok {
		t.Fatalf("failed to parse returned permissions: %s", updatedRole.Permissions)
	}

	hasUnknownBit := new(big.Int).And(returnedPerms, unknownBit)
	if hasUnknownBit.Cmp(big.NewInt(0)) != 0 {
		t.Fatalf("expected unknown bit to be stripped, but permissions still contain it: %s", updatedRole.Permissions)
	}

	hasSendMessages := new(big.Int).And(returnedPerms, sendMessages)
	if hasSendMessages.Cmp(sendMessages) != 0 {
		t.Fatalf("expected SEND_MESSAGES bit to be preserved, got permissions: %s", updatedRole.Permissions)
	}
}
