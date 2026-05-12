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

func TestAuthLoginInvalidCredentials(t *testing.T) {
	client := newTestClient(t)

	t.Run("wrong password returns bad request with field errors", func(t *testing.T) {
		account := createTestAccount(t, client)

		loginReq := loginRequest{
			Email:    account.Email,
			Password: "WrongPassword123!",
		}

		resp, err := client.postJSON("/auth/login", loginReq)
		if err != nil {
			t.Fatalf("failed to call login endpoint: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for wrong password, got %d: %s", resp.StatusCode, readResponseBody(resp))
		}
	})

	t.Run("non-existent email returns bad request with field errors", func(t *testing.T) {
		loginReq := loginRequest{
			Email:    "nonexistent@example.com",
			Password: "SomePassword123!",
		}

		resp, err := client.postJSON("/auth/login", loginReq)
		if err != nil {
			t.Fatalf("failed to call login endpoint: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for non-existent email, got %d: %s", resp.StatusCode, readResponseBody(resp))
		}
	})

	t.Run("invalid email format returns bad request", func(t *testing.T) {
		loginReq := loginRequest{
			Email:    "not-an-email",
			Password: "SomePassword123!",
		}

		resp, err := client.postJSON("/auth/login", loginReq)
		if err != nil {
			t.Fatalf("failed to call login endpoint: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusBadRequest && resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 400 Bad Request or 401 Unauthorized for invalid email format, got %d: %s", resp.StatusCode, readResponseBody(resp))
		}
	})

	t.Run("empty password returns bad request or unauthorized", func(t *testing.T) {
		loginReq := loginRequest{
			Email:    "test@example.com",
			Password: "",
		}

		resp, err := client.postJSON("/auth/login", loginReq)
		if err != nil {
			t.Fatalf("failed to call login endpoint: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusBadRequest && resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 400 Bad Request or 401 Unauthorized for empty password, got %d: %s", resp.StatusCode, readResponseBody(resp))
		}
	})

	t.Run("empty email returns bad request or unauthorized", func(t *testing.T) {
		loginReq := loginRequest{
			Email:    "",
			Password: "SomePassword123!",
		}

		resp, err := client.postJSON("/auth/login", loginReq)
		if err != nil {
			t.Fatalf("failed to call login endpoint: %v", err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusBadRequest && resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("expected 400 Bad Request or 401 Unauthorized for empty email, got %d: %s", resp.StatusCode, readResponseBody(resp))
		}
	})
}
