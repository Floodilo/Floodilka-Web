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

func uniqueTestPhone() string {
	return fmt.Sprintf("+7999%07d", time.Now().UnixNano()%10000000)
}

type registerTicketResponse struct {
	Ticket string `json:"ticket"`
}

// registerPhoneTestUser drives the two-step phone registration. SMS is
// disabled in the integration environment, so any 6-digit code passes
// verification.
func registerPhoneTestUser(t testing.TB, client *testClient, phone, password string) registerResponse {
	t.Helper()

	resp, err := client.postJSON("/auth/register", map[string]any{
		"phone":         phone,
		"username":      fmt.Sprintf("itestphone%x", time.Now().UnixNano()),
		"global_name":   "Phone Integration Tester",
		"password":      password,
		"date_of_birth": adultDateOfBirth(),
		"consent":       true,
	})
	if err != nil {
		t.Fatalf("failed to call register endpoint: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("register returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var ticketResp registerTicketResponse
	decodeJSONResponse(t, resp, &ticketResp)
	if ticketResp.Ticket == "" {
		t.Fatalf("expected non-empty ticket in register response")
	}

	verifyResp, err := client.postJSON("/auth/register/verify", map[string]any{
		"ticket": ticketResp.Ticket,
		"code":   "123456",
	})
	if err != nil {
		t.Fatalf("failed to call register verify endpoint: %v", err)
	}
	if verifyResp.StatusCode != http.StatusOK {
		t.Fatalf("register verify returned %d: %s", verifyResp.StatusCode, readResponseBody(verifyResp))
	}

	var parsed registerResponse
	decodeJSONResponse(t, verifyResp, &parsed)
	return parsed
}

func TestAuthPhoneRegisterAndLoginFlow(t *testing.T) {
	client := newTestClient(t)

	phone := uniqueTestPhone()
	password := uniquePassword()

	registered := registerPhoneTestUser(t, client, phone, password)
	if registered.Token == "" || registered.UserID == "" {
		t.Fatalf("expected user_id and token after phone registration, got %+v", registered)
	}

	loginResp, err := client.postJSON("/auth/login", map[string]any{
		"phone":    phone,
		"password": password,
	})
	if err != nil {
		t.Fatalf("failed to call login endpoint: %v", err)
	}
	if loginResp.StatusCode != http.StatusOK {
		t.Fatalf("phone login returned %d: %s", loginResp.StatusCode, readResponseBody(loginResp))
	}

	var login loginResponse
	decodeJSONResponse(t, loginResp, &login)
	if login.MFA {
		t.Fatalf("did not expect MFA challenge for fresh phone user")
	}
	if login.Token == "" || login.UserID != registered.UserID {
		t.Fatalf("expected token for user %s, got %+v", registered.UserID, login)
	}
}

func TestAuthPhoneRegisterRejectsDuplicatePhone(t *testing.T) {
	client := newTestClient(t)

	phone := uniqueTestPhone()
	password := uniquePassword()

	registerPhoneTestUser(t, client, phone, password)

	resp, err := client.postJSON("/auth/register", map[string]any{
		"phone":         phone,
		"username":      fmt.Sprintf("itestphonedup%x", time.Now().UnixNano()),
		"password":      uniquePassword(),
		"date_of_birth": adultDateOfBirth(),
		"consent":       true,
	})
	if err != nil {
		t.Fatalf("failed to call register endpoint: %v", err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected duplicate phone registration to fail, got 200: %s", readResponseBody(resp))
	}
}

func TestAuthPhonePasswordResetFlow(t *testing.T) {
	client := newTestClient(t)

	phone := uniqueTestPhone()
	password := uniquePassword()

	registered := registerPhoneTestUser(t, client, phone, password)

	forgotResp, err := client.postJSON("/auth/forgot", map[string]any{"phone": phone})
	if err != nil {
		t.Fatalf("failed to call forgot endpoint: %v", err)
	}
	if forgotResp.StatusCode < 200 || forgotResp.StatusCode >= 300 {
		t.Fatalf("forgot returned %d: %s", forgotResp.StatusCode, readResponseBody(forgotResp))
	}
	forgotResp.Body.Close()

	verifyResp, err := client.postJSON("/auth/forgot/verify", map[string]any{
		"phone": phone,
		"code":  "123456",
	})
	if err != nil {
		t.Fatalf("failed to call forgot verify endpoint: %v", err)
	}
	if verifyResp.StatusCode != http.StatusOK {
		t.Fatalf("forgot verify returned %d: %s", verifyResp.StatusCode, readResponseBody(verifyResp))
	}

	var verify struct {
		ResetToken string `json:"resetToken"`
	}
	decodeJSONResponse(t, verifyResp, &verify)
	if verify.ResetToken == "" {
		t.Fatalf("expected non-empty reset token")
	}

	newPassword := uniquePassword()
	resetResp, err := client.postJSON("/auth/reset", map[string]any{
		"token":    verify.ResetToken,
		"password": newPassword,
	})
	if err != nil {
		t.Fatalf("failed to call reset endpoint: %v", err)
	}
	if resetResp.StatusCode != http.StatusOK {
		t.Fatalf("reset returned %d: %s", resetResp.StatusCode, readResponseBody(resetResp))
	}
	resetResp.Body.Close()

	loginResp, err := client.postJSON("/auth/login", map[string]any{
		"phone":    phone,
		"password": newPassword,
	})
	if err != nil {
		t.Fatalf("failed to call login endpoint: %v", err)
	}
	if loginResp.StatusCode != http.StatusOK {
		t.Fatalf("login with new password returned %d: %s", loginResp.StatusCode, readResponseBody(loginResp))
	}

	var login loginResponse
	decodeJSONResponse(t, loginResp, &login)
	if login.UserID != registered.UserID {
		t.Fatalf("expected login as user %s, got %+v", registered.UserID, login)
	}
}
