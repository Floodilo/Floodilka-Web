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

// TestOAuth2TokenRevokeInvalidToken verifies that revoking an invalid
// token succeeds (idempotent operation per RFC 7009).
func TestOAuth2TokenRevokeInvalidToken(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)

	redirectURI := "https://example.com/revoke/invalid"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Revoke Invalid %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify"},
	)

	revokeOAuth2Token(t, client, appID, clientSecret, "invalid-token-12345", "access_token")

}
