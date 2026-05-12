/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
	"time"
)

// TestOAuth2ApplicationListIsolation validates that users only see their own applications,
// ensuring ownership isolation is enforced.
func TestOAuth2ApplicationListIsolation(t *testing.T) {
	client := newTestClient(t)
	user1 := createTestAccount(t, client)
	user2 := createTestAccount(t, client)

	user1AppName := fmt.Sprintf("User1 App %d", time.Now().UnixNano())
	user1AppID, _, _ := createOAuth2BotApplication(t, client, user1, user1AppName, []string{"https://example.com/user1"})

	user2AppName := fmt.Sprintf("User2 App %d", time.Now().UnixNano())
	user2AppID, _, _ := createOAuth2BotApplication(t, client, user2, user2AppName, []string{"https://example.com/user2"})

	user1Apps := listOAuth2Applications(t, client, user1.Token)
	var foundUser1App, foundUser2AppInUser1List bool
	for _, app := range user1Apps {
		if app.ID == user1AppID {
			foundUser1App = true
		}
		if app.ID == user2AppID {
			foundUser2AppInUser1List = true
		}
	}

	if !foundUser1App {
		t.Fatalf("user1 should see their own application")
	}
	if foundUser2AppInUser1List {
		t.Fatalf("user1 should not see user2's applications")
	}

	user2Apps := listOAuth2Applications(t, client, user2.Token)
	var foundUser2App, foundUser1AppInUser2List bool
	for _, app := range user2Apps {
		if app.ID == user2AppID {
			foundUser2App = true
		}
		if app.ID == user1AppID {
			foundUser1AppInUser2List = true
		}
	}

	if !foundUser2App {
		t.Fatalf("user2 should see their own application")
	}
	if foundUser1AppInUser2List {
		t.Fatalf("user2 should not see user1's applications")
	}
}
