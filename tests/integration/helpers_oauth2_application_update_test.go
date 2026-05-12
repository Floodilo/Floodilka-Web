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

// updateOAuth2Application updates an OAuth2 application with the provided changes.
func updateOAuth2Application(t testing.TB, client *testClient, token string, applicationID string, updates map[string]any) oauth2ApplicationResponse {
	t.Helper()
	resp, err := client.patchJSONWithAuth(fmt.Sprintf("/oauth2/applications/%s", applicationID), updates, token)
	if err != nil {
		t.Fatalf("failed to update application: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("update application failed: %s", readResponseBody(resp))
	}
	var app oauth2ApplicationResponse
	decodeJSONResponse(t, resp, &app)
	return app
}
