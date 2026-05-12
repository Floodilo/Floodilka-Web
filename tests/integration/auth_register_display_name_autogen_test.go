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

func TestAuthRegisterDerivesUsernameFromDisplayName(t *testing.T) {
	client := newTestClient(t)

	email := fmt.Sprintf("integration-derived-username-%d@example.com", time.Now().UnixNano())
	password := uniquePassword()

	payload := map[string]any{
		"email":         email,
		"password":      password,
		"global_name":   "Magic Tester",
		"date_of_birth": adultDateOfBirth(),
		"consent":       true,
	}

	resp, err := client.postJSON("/auth/register", payload)
	if err != nil {
		t.Fatalf("failed to call register endpoint: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("register returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var parsed registerResponse
	decodeJSONResponse(t, resp, &parsed)
	if parsed.Token == "" {
		t.Fatalf("expected register response to include a token")
	}

	meResp, err := client.getWithAuth("/users/@me", parsed.Token)
	if err != nil {
		t.Fatalf("failed to fetch current user: %v", err)
	}
	if meResp.StatusCode != http.StatusOK {
		t.Fatalf("/users/@me returned %d: %s", meResp.StatusCode, readResponseBody(meResp))
	}

	var userResp userPrivateResponse
	decodeJSONResponse(t, meResp, &userResp)
	if userResp.Username != "Magic_Tester" {
		t.Fatalf("expected derived username to be %q, got %q", "Magic_Tester", userResp.Username)
	}
}
