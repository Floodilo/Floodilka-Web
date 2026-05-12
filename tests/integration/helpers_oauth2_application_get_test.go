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

// getOAuth2Application retrieves a specific OAuth2 application by ID.
func getOAuth2Application(t testing.TB, client *testClient, token string, applicationID string) oauth2ApplicationResponse {
	t.Helper()
	resp, err := client.getWithAuth(fmt.Sprintf("/oauth2/applications/%s", applicationID), token)
	if err != nil {
		t.Fatalf("failed to get application: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("get application failed: %s", readResponseBody(resp))
	}
	var app oauth2ApplicationResponse
	decodeJSONResponse(t, resp, &app)
	return app
}
