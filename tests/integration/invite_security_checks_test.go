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
	"time"
)

// TestInviteSecurityChecks tests invite system security
func TestInviteSecurityChecks(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)
	attacker := createTestAccount(t, client)

	guild := createGuild(t, client, owner.Token, fmt.Sprintf("Invite Security %d", time.Now().UnixNano()))
	channelID := parseSnowflake(t, guild.SystemChannel)

	invite := createChannelInvite(t, client, owner.Token, channelID)

	resp, err := client.get(fmt.Sprintf("/invites/%s", invite.Code))
	if err != nil {
		t.Fatalf("failed to get invite: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/invites/%s", invite.Code), attacker.Token)
	if err != nil {
		t.Fatalf("failed to attempt invite delete: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden && resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 403/404 for deleting others' invite, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = client.delete(fmt.Sprintf("/invites/%s", invite.Code), owner.Token)
	if err != nil {
		t.Fatalf("failed to delete own invite: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	resp, err = client.get(fmt.Sprintf("/invites/%s", invite.Code))
	if err != nil {
		t.Fatalf("failed to check deleted invite: %v", err)
	}
	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for deleted invite, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
