/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"testing"
)

// TestOAuth2ApplicationListEmpty validates that an empty list is returned when user has no applications.
func TestOAuth2ApplicationListEmpty(t *testing.T) {
	client := newTestClient(t)
	owner := createTestAccount(t, client)

	apps := listOAuth2Applications(t, client, owner.Token)

	if apps == nil {
		t.Fatalf("expected empty array, got nil")
	}
	if len(apps) != 0 {
		t.Fatalf("expected empty list for new user, got %d applications", len(apps))
	}
}
