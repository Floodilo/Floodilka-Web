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

func TestAuthPhoneVerificationFlow(t *testing.T) {
	client := newTestClient(t)
	account := createTestAccount(t, client)

	secret := newTotpSecret(t)
	resp, err := client.postJSONWithAuth("/users/@me/mfa/totp/enable", map[string]string{
		"secret": secret,
		"code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to enable totp: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("enable totp returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	phone := fmt.Sprintf("+1555%07d", time.Now().UnixNano()%10000000)

	resp, err = client.postJSONWithAuth("/users/@me/phone/send-verification", map[string]string{
		"phone": phone,
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to send phone verification: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("send phone verification returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	resp, err = client.postJSONWithAuth("/users/@me/phone/verify", map[string]string{
		"phone": phone,
		"code":  "123456",
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to verify phone: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("verify phone returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var phoneVerify phoneVerifyResponse
	decodeJSONResponse(t, resp, &phoneVerify)
	if phoneVerify.PhoneToken == "" {
		t.Fatalf("expected phone verify to return token")
	}

	resp, err = client.postJSONWithAuth("/users/@me/phone", map[string]any{
		"phone_token": phoneVerify.PhoneToken,
		"mfa_method":  "totp",
		"mfa_code":    totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to attach phone: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("attach phone returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to fetch current user: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("fetch current user returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var user struct {
		Phone *string `json:"phone"`
	}
	decodeJSONResponse(t, resp, &user)
	if user.Phone == nil || *user.Phone != phone {
		got := ""
		if user.Phone != nil {
			got = *user.Phone
		}
		t.Fatalf("expected user phone to be %s, got %s", phone, got)
	}

	resp, err = client.deleteJSONWithAuth("/users/@me/phone", map[string]any{
		"mfa_method": "totp",
		"mfa_code":   totpCodeNow(t, secret),
	}, account.Token)
	if err != nil {
		t.Fatalf("failed to remove phone: %v", err)
	}
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("remove phone returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}
	resp.Body.Close()

	resp, err = client.getWithAuth("/users/@me", account.Token)
	if err != nil {
		t.Fatalf("failed to fetch current user after removal: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("fetch current user after removal returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	decodeJSONResponse(t, resp, &user)
	if user.Phone != nil && *user.Phone != "" {
		t.Fatalf("expected user phone to be empty after removal, got %s", *user.Phone)
	}
}
