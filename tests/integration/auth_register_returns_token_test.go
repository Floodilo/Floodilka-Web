/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"fmt"
	"testing"
	"time"
)

func TestAuthRegisterReturnsToken(t *testing.T) {
	client := newTestClient(t)

	email := fmt.Sprintf("integration-register-%d@example.com", time.Now().UnixNano())
	password := uniquePassword()

	resp := registerTestUser(t, client, email, password)
	if resp.Token == "" {
		t.Fatalf("expected non-empty token in register response")
	}
	if resp.UserID == "" {
		t.Fatalf("expected non-empty user_id in register response")
	}
}
