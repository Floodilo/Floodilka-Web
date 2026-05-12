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
	"strings"
	"testing"
	"time"
)

const registerPasswordMinLength = 8

func registerTestUser(t testing.TB, client *testClient, email, password string, opts ...registerOption) registerResponse {
	t.Helper()

	req := registerRequest{
		Email:       email,
		Username:    fmt.Sprintf("itest%x", time.Now().UnixNano()),
		GlobalName:  "Integration Tester",
		Password:    password,
		DateOfBirth: adultDateOfBirth(),
		Consent:     true,
	}

	for _, opt := range opts {
		opt(&req)
	}

	req.Password = ensureMinPasswordLength(req.Password)

	var resp *http.Response
	var err error
	for attempt := 1; attempt <= 3; attempt++ {
		resp, err = client.postJSON("/auth/register", req)
		if err == nil && resp.StatusCode == http.StatusOK {
			break
		}

		if resp != nil && resp.StatusCode < http.StatusInternalServerError {
			break
		}

		if resp != nil {
			resp.Body.Close()
		}
		time.Sleep(time.Duration(attempt) * time.Second)
	}
	if err != nil {
		t.Fatalf("failed to call register endpoint: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("register returned %d: %s", resp.StatusCode, readResponseBody(resp))
	}

	var parsed registerResponse
	decodeJSONResponse(t, resp, &parsed)
	return parsed
}

func withDateOfBirth(date string) registerOption {
	return func(req *registerRequest) {
		req.DateOfBirth = date
	}
}

func ensureMinPasswordLength(password string) string {
	if len(password) >= registerPasswordMinLength {
		return password
	}
	return password + strings.Repeat("X", registerPasswordMinLength-len(password))
}
