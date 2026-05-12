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

func TestUsersMeWithToken(t *testing.T) {
	client := newTestClient(t)

	email := fmt.Sprintf("integration-usersme-%d@example.com", time.Now().UnixNano())
	password := uniquePassword()

	reg := registerTestUser(t, client, email, password)

	resp, err := client.getWithAuth("/users/@me", reg.Token)
	if err != nil {
		t.Fatalf("failed to call /users/@me: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("GET /users/@me returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var userResp userPrivateResponse
	decodeJSONResponse(t, resp, &userResp)

	if userResp.ID != reg.UserID {
		t.Fatalf("expected /users/@me id %s to match registered user %s", userResp.ID, reg.UserID)
	}
	if userResp.Email != email {
		t.Fatalf("expected /users/@me email %s to match registration email %s", userResp.Email, email)
	}
	if userResp.Username == "" {
		t.Fatalf("expected /users/@me to include username")
	}
}
