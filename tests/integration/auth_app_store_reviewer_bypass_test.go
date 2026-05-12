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

// TestAuthAppStoreReviewerIPBypass verifies that users with the APP_STORE_REVIEWER flag
// can login from any IP address without triggering the "new login location" email verification.
func TestAuthAppStoreReviewerIPBypass(t *testing.T) {
	client := newTestClient(t)
	initialIP := client.clientIP

	email := fmt.Sprintf("app-store-reviewer-%d@example.com", time.Now().UnixNano())
	password := uniquePassword()

	reg := registerTestUser(t, client, email, password)

	// Set the APP_STORE_REVIEWER flag on the user
	updateUserSecurityFlags(t, client, reg.UserID, userSecurityFlagsPayload{
		SetFlags: []string{"APP_STORE_REVIEWER"},
	})

	differentIP := "10.99.88.77"
	if differentIP == initialIP {
		differentIP = "10.99.88.78"
	}
	clientWithDifferentIP := &testClient{
		baseURL:    client.baseURL,
		httpClient: client.httpClient,
		clientIP:   differentIP,
	}

	loginReq := loginRequest{
		Email:    email,
		Password: password,
	}

	resp, err := clientWithDifferentIP.postJSON("/auth/login", loginReq)
	if err != nil {
		t.Fatalf("failed to call login endpoint: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body := readResponseBody(resp)
		t.Fatalf("expected login to succeed for APP_STORE_REVIEWER from new IP, got status %d: %s", resp.StatusCode, body)
	}

	var loginResp loginResponse
	decodeJSONResponse(t, resp, &loginResp)

	if loginResp.MFA {
		t.Fatalf("expected MFA to be false for APP_STORE_REVIEWER account without MFA enabled")
	}
	if loginResp.Token == "" {
		t.Fatalf("expected login response to include token")
	}
	if loginResp.UserID != reg.UserID {
		t.Fatalf("expected login user_id %s to match registration %s", loginResp.UserID, reg.UserID)
	}
}
