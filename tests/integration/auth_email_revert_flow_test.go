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

func TestAuthEmailRevertFlow(t *testing.T) {
	client := newTestClient(t)

	t.Run("revert restores original email and clears mfa", func(t *testing.T) {
		account := createTestAccount(t, client)
		clearTestEmails(t, client)

		startResp := startEmailChange(t, client, account, account.Password)

		var originalProof string
		if startResp.RequireOriginal {
			originalEmail := waitForEmail(t, client, "email_change_original", account.Email)
			originalCode := originalEmail.Metadata["code"]
			originalProof = verifyOriginalEmailChange(t, client, account, startResp.Ticket, originalCode, account.Password)
		} else {
			originalProof = *startResp.OriginalProof
		}

		newEmail := fmt.Sprintf("integration-revert-%d@example.com", time.Now().UnixNano())
		requestNewEmailChange(t, client, account, startResp.Ticket, newEmail, originalProof, account.Password)

		newEmailData := waitForEmail(t, client, "email_change_new", newEmail)
		newCode := newEmailData.Metadata["code"]
		if newCode == "" {
			t.Fatalf("expected new email code in metadata")
		}

		emailToken := verifyNewEmailChange(t, client, account, startResp.Ticket, newCode, originalProof, account.Password)

		resp, err := client.patchJSONWithAuth("/users/@me", map[string]any{
			"email_token": emailToken,
			"password":    account.Password,
		}, account.Token)
		if err != nil {
			t.Fatalf("failed to finalize email change: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		resp.Body.Close()

		revertEmail := waitForEmail(t, client, "email_change_revert", account.Email)
		revertToken := revertEmail.Metadata["token"]
		if revertToken == "" {
			t.Fatalf("expected revert token in email metadata")
		}

		newPassword := uniquePassword()
		resp, err = client.postJSON("/auth/email-revert", map[string]any{
			"token":    revertToken,
			"password": newPassword,
		})
		if err != nil {
			t.Fatalf("failed to call email revert endpoint: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var revertResp loginResponse
		decodeJSONResponse(t, resp, &revertResp)
		resp.Body.Close()

		if revertResp.Token == "" {
			t.Fatalf("expected revert to return a new token")
		}

		if respOld, err := client.getWithAuth("/users/@me", account.Token); err == nil {
			if respOld.StatusCode == http.StatusOK {
				t.Fatalf("expected old session token to be invalidated after revert")
			}
			respOld.Body.Close()
		}

		resp, err = client.getWithAuth("/users/@me", revertResp.Token)
		if err != nil {
			t.Fatalf("failed to fetch user with reverted token: %v", err)
		}
		assertStatus(t, resp, http.StatusOK)
		var user userPrivateResponse
		decodeJSONResponse(t, resp, &user)
		resp.Body.Close()

		if user.Email != account.Email {
			t.Fatalf("expected email to revert to %s, got %s", account.Email, user.Email)
		}
		if user.MfaEnabled || len(user.AuthenticatorTypes) > 0 {
			t.Fatalf("expected MFA to be disabled after revert")
		}
		if user.Phone != nil {
			t.Fatalf("expected phone number to be removed after revert, got %v", *user.Phone)
		}
		if user.PasswordLastChangedAt == nil {
			t.Fatalf("expected password_last_changed_at to be set after revert")
		}

		login := loginTestUser(t, client, account.Email, newPassword)
		if login.Token == "" {
			t.Fatalf("expected login with new password to succeed")
		}

		resp, err = client.postJSON("/auth/login", loginRequest{Email: account.Email, Password: account.Password})
		if err != nil {
			t.Fatalf("failed to call login with old password: %v", err)
		}
		if resp.StatusCode == http.StatusOK {
			t.Fatalf("expected old password login to fail after revert")
		}
		assertStatus(t, resp, http.StatusBadRequest)
		resp.Body.Close()
	})
}
