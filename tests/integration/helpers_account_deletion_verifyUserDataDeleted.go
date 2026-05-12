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

// verifyUserDataDeleted checks that all user data has been properly deleted or anonymized
func verifyUserDataDeleted(t testing.TB, client *testClient, userID string) {
	resp, err := client.get(fmt.Sprintf("/test/users/%s/data-exists", userID))
	if err != nil {
		t.Fatalf("failed to check user data: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.StatusCode)
	}

	var data userDataExistsResponse
	decodeJSONResponse(t, resp, &data)

	if !data.UserExists {
		t.Fatal("expected user to still exist (anonymized), but user was completely removed")
	}

	if !data.HasDeletedFlag {
		t.Error("expected user to have DELETED flag set")
	}

	if !data.EmailCleared {
		t.Error("expected email to be cleared")
	}

	if !data.PasswordCleared {
		t.Error("expected password to be cleared")
	}

	if data.RelationshipsCount != 0 {
		t.Errorf("expected 0 relationships, got %d", data.RelationshipsCount)
	}

	if data.SessionsCount != 0 {
		t.Errorf("expected 0 sessions, got %d", data.SessionsCount)
	}

	if data.OAuthTokensCount != 0 {
		t.Errorf("expected 0 oauth tokens, got %d", data.OAuthTokensCount)
	}

	if data.PinnedDmsCount != 0 {
		t.Errorf("expected 0 pinned DMs, got %d", data.PinnedDmsCount)
	}

	if data.SavedMessagesCount != 0 {
		t.Errorf("expected 0 saved messages, got %d", data.SavedMessagesCount)
	}

	t.Log("User data successfully deleted/anonymized")
}
