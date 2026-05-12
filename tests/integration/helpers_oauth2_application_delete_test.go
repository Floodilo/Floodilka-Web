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

// deleteOAuth2Application deletes an OAuth2 application.
func deleteOAuth2Application(t testing.TB, client *testClient, owner testAccount, applicationID string) {
	t.Helper()
	sudoPayload := map[string]any{
		"password": owner.Password,
	}
	resp, err := client.deleteJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", applicationID), sudoPayload, owner.Token)
	if err != nil {
		t.Fatalf("failed to delete application: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("delete application failed with status %d: %s", resp.StatusCode, readResponseBody(resp))
	}
}
