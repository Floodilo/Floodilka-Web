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

// TestOAuth2ApplicationDeleteWithWrongPassword validates that incorrect password is rejected.
func TestOAuth2ApplicationDeleteWithWrongPassword(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	name := fmt.Sprintf("Wrong Pass Test %d", time.Now().UnixNano())
	redirectURIs := []string{"https://example.com/callback"}
	scopes := []string{"identify"}

	var _ []string = scopes
	appID, _, _ := createOAuth2BotApplication(t, client, owner, name, redirectURIs)

	sudoPayload := map[string]any{
		"password": "wrong-password",
	}

	resp, err := client.deleteJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", appID), sudoPayload, owner.Token)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNoContent {
		t.Fatalf("delete should reject incorrect password")
	}

	app := getOAuth2Application(t, client, owner.Token, appID)
	if app.ID != appID {
		t.Fatalf("application should not have been deleted with wrong password")
	}
}
