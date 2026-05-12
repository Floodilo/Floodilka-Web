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

// TestChannelOverwriteIgnoresUnknownPermissionBits verifies that setting channel permission
// overwrites with unknown permission bits succeeds and the unknown bits are stripped.
func TestChannelOverwriteIgnoresUnknownPermissionBits(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, "Unknown Bits Overwrite Guild")
	guildID := parseSnowflake(t, guild.ID)

	channel := createGuildChannel(t, client, owner.Token, guildID, "unknown-bits-channel")
	channelID := parseSnowflake(t, channel.ID)

	resp, err := client.postJSONWithAuth(fmt.Sprintf("/guilds/%d/roles", guildID), map[string]any{
		"name":        "overwrite-target",
		"permissions": "0",
	}, owner.Token)
	if err != nil {
		t.Fatalf("failed to create role: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	var role struct {
		ID string `json:"id"`
	}
	decodeJSONResponse(t, resp, &role)

	sendMessages := new(big.Int).Lsh(big.NewInt(1), 11)
	viewChannel := new(big.Int).Lsh(big.NewInt(1), 10)
	unknownBit := new(big.Int).Lsh(big.NewInt(1), 60)

	allowWithUnknown := new(big.Int).Or(sendMessages, unknownBit)
	denyWithUnknown := new(big.Int).Or(viewChannel, unknownBit)

	resp, err = client.requestJSON(http.MethodPut, fmt.Sprintf("/channels/%d/permissions/%s", channelID, role.ID), map[string]any{
		"type":  0,
		"allow": allowWithUnknown.String(),
		"deny":  denyWithUnknown.String(),
	}, owner.Token)
	if err != nil {
		t.Fatalf("failed to PUT overwrite: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.getWithAuth(fmt.Sprintf("/channels/%d", channelID), owner.Token)
	if err != nil {
		t.Fatalf("failed to fetch channel: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var channelResp struct {
		PermissionOverwrites []struct {
			ID    string `json:"id"`
			Type  int    `json:"type"`
			Allow string `json:"allow"`
			Deny  string `json:"deny"`
		} `json:"permission_overwrites"`
	}
	decodeJSONResponse(t, resp, &channelResp)

	// Find the overwrite for our role
	var foundOverwrite *struct {
		ID    string `json:"id"`
		Type  int    `json:"type"`
		Allow string `json:"allow"`
		Deny  string `json:"deny"`
	}
	for i := range channelResp.PermissionOverwrites {
		if channelResp.PermissionOverwrites[i].ID == role.ID {
			foundOverwrite = &channelResp.PermissionOverwrites[i]
			break
		}
	}

	if foundOverwrite == nil {
		t.Fatalf("expected to find permission overwrite for role %s", role.ID)
	}

	returnedAllow, ok := new(big.Int).SetString(foundOverwrite.Allow, 10)
	if !ok {
		t.Fatalf("failed to parse allow permissions: %s", foundOverwrite.Allow)
	}

	hasUnknownInAllow := new(big.Int).And(returnedAllow, unknownBit)
	if hasUnknownInAllow.Cmp(big.NewInt(0)) != 0 {
		t.Fatalf("expected unknown bit to be stripped from allow, got: %s", foundOverwrite.Allow)
	}

	hasSendMessages := new(big.Int).And(returnedAllow, sendMessages)
	if hasSendMessages.Cmp(sendMessages) != 0 {
		t.Fatalf("expected SEND_MESSAGES bit to be preserved in allow, got: %s", foundOverwrite.Allow)
	}

	returnedDeny, ok := new(big.Int).SetString(foundOverwrite.Deny, 10)
	if !ok {
		t.Fatalf("failed to parse deny permissions: %s", foundOverwrite.Deny)
	}

	hasUnknownInDeny := new(big.Int).And(returnedDeny, unknownBit)
	if hasUnknownInDeny.Cmp(big.NewInt(0)) != 0 {
		t.Fatalf("expected unknown bit to be stripped from deny, got: %s", foundOverwrite.Deny)
	}

	hasViewChannel := new(big.Int).And(returnedDeny, viewChannel)
	if hasViewChannel.Cmp(viewChannel) != 0 {
		t.Fatalf("expected VIEW_CHANNEL bit to be preserved in deny, got: %s", foundOverwrite.Deny)
	}
}
