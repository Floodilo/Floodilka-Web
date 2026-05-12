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

const (
	requireVerifiedEmail = 1 << 0
	requireVerifiedPhone = 1 << 2
)

type suspiciousActivityErrorResponse struct {
	errorResponse
	Data struct {
		SuspiciousActivityFlags int `json:"suspicious_activity_flags"`
	} `json:"data"`
}

func TestAuthEmailVerificationOnlyClearsEmailRelatedSuspiciousFlags(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	clearTestEmails(t, client)

	updateUserSecurityFlags(t, client, account.UserID, userSecurityFlagsPayload{
		SuspiciousActivityFlagNames: []string{"REQUIRE_VERIFIED_EMAIL", "REQUIRE_VERIFIED_PHONE"},
	})

	checkSuspiciousFlags := func(expected int) {
		resp, err := client.getWithAuth("/users/@me", account.Token)
		if err != nil {
			t.Fatalf("failed to fetch /users/@me: %v", err)
		}
		assertStatus(t, resp, http.StatusForbidden)
		var errBody suspiciousActivityErrorResponse
		decodeJSONResponse(t, resp, &errBody)
		if errBody.Data.SuspiciousActivityFlags != expected {
			t.Fatalf("expected suspicious flags %d, got %d", expected, errBody.Data.SuspiciousActivityFlags)
		}
	}

	checkSuspiciousFlags(requireVerifiedEmail | requireVerifiedPhone)

	resp, err := client.postJSONWithAuth("/auth/verify/resend", nil, account.Token)
	if err != nil {
		t.Fatalf("failed to request verification email: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	email := waitForEmail(t, client, "email_verification", account.Email)
	token, ok := email.Metadata["token"]
	if !ok || token == "" {
		t.Fatalf("expected verification token in email metadata")
	}

	resp, err = client.postJSON("/auth/verify", map[string]string{"token": token})
	if err != nil {
		t.Fatalf("failed to verify email: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

	checkSuspiciousFlags(requireVerifiedPhone)
}
