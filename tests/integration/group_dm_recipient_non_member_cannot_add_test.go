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

// TestGroupDMRecipientNonMemberCannotAdd ensures only channel participants can add recipients and friendship rules are enforced
func TestGroupDMRecipientNonMemberCannotAdd(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	member := createTestAccount(t, client)
	third := createTestAccount(t, client)
	outsider := createTestAccount(t, client)
	ownerFriend := createTestAccount(t, client)

	createFriendship(t, client, owner, member)
	createFriendship(t, client, owner, third)
	createFriendship(t, client, member, third)
	createFriendship(t, client, outsider, third)
	createFriendship(t, client, owner, ownerFriend)

	groupChannel := createGroupDmChannel(t, client, owner.Token, member.UserID, third.UserID)
	groupID := parseSnowflake(t, groupChannel.ID)

	resp, err := client.putJSONWithAuth(fmt.Sprintf("/channels/%d/recipients/%s", groupID, third.UserID), nil, outsider.Token)
	if err != nil {
		t.Fatalf("outsider failed to attempt add: %v", err)
	}
	if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusNoContent {
		t.Fatalf("expected non-participant to be blocked from adding recipients")
	}
	resp.Body.Close()

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/channels/%d/recipients/%s", groupID, ownerFriend.UserID), nil, owner.Token)
	if err != nil {
		t.Fatalf("owner failed to add recipient: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected owner add to succeed with 204, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.putJSONWithAuth(fmt.Sprintf("/channels/%d/recipients/%s", groupID, outsider.UserID), nil, member.Token)
	if err != nil {
		t.Fatalf("member failed to attempt add outsider after conversion: %v", err)
	}
	if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusNoContent {
		t.Fatalf("expected member to be unable to add non-friend outsider")
	}
	resp.Body.Close()
}
