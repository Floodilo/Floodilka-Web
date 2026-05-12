/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"net/http"
	"testing"
)

func TestAuthUsernameSuggestions(t *testing.T) {
	client := newTestClient(t)
	resp, err := client.postJSON("/auth/username-suggestions", map[string]string{"global_name": "Integration Tester"})
	if err != nil {
		t.Fatalf("failed to call username suggestions: %v", err)
	}
	assertStatus(t, resp, http.StatusOK)

	var suggestions usernameSuggestionsResponse
	decodeJSONResponse(t, resp, &suggestions)
	if len(suggestions.Suggestions) == 0 {
		t.Fatalf("expected username suggestions to be returned")
	}
}

type usernameSuggestionsResponse struct {
	Suggestions []string `json:"suggestions"`
}
