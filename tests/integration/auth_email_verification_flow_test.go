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

func TestAuthEmailVerificationFlow(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)
	clearTestEmails(t, client)

	resp, err := client.postJSONWithAuth("/auth/verify/resend", nil, account.Token)
	if err != nil {
		t.Fatalf("failed to call resend verification: %v", err)
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
		t.Fatalf("failed to call verify: %v", err)
	}
	assertStatus(t, resp, http.StatusNoContent)
	resp.Body.Close()

}
