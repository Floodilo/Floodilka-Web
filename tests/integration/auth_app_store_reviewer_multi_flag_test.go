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

// TestAuthAppStoreReviewerWithOtherFlags verifies that the APP_STORE_REVIEWER flag works
// correctly even when combined with other user flags.
func TestAuthAppStoreReviewerWithOtherFlags(t *testing.T) {
	client := newTestClient(t)
	initialIP := client.clientIP

	email := fmt.Sprintf("reviewer-multi-flag-%d@example.com", time.Now().UnixNano())
	password := uniquePassword()

	reg := registerTestUser(t, client, email, password)

	// Set APP_STORE_REVIEWER along with STAFF flag
	updateUserSecurityFlags(t, client, reg.UserID, userSecurityFlagsPayload{
		SetFlags: []string{"APP_STORE_REVIEWER", "STAFF"},
	})

	differentIP := "10.77.66.55"
	if differentIP == initialIP {
		differentIP = "10.77.66.56"
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
		t.Fatalf("expected login to succeed for APP_STORE_REVIEWER with other flags from new IP, got status %d: %s", resp.StatusCode, body)
	}

	var loginResp loginResponse
	decodeJSONResponse(t, resp, &loginResp)

	if loginResp.Token == "" {
		t.Fatalf("expected login response to include token")
	}
}
