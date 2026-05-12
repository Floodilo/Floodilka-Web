/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"testing"
)

func createTestAccount(t testing.TB, client *testClient, opts ...registerOption) testAccount {
	t.Helper()

	// Generate a short random hex string for unique email
	var randomBytes [6]byte
	if _, err := rand.Read(randomBytes[:]); err != nil {
		t.Fatalf("failed to generate random bytes: %v", err)
	}

	email := fmt.Sprintf("test-%s@example.com", hex.EncodeToString(randomBytes[:]))
	password := uniquePassword()
	resp := registerTestUser(t, client, email, password, opts...)

	updateUserSecurityFlags(t, client, resp.UserID, userSecurityFlagsPayload{
		SetFlags: []string{"HAS_SESSION_STARTED"},
	})

	return testAccount{
		UserID:   resp.UserID,
		Token:    resp.Token,
		Email:    email,
		Password: password,
	}
}
