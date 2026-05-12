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

// TestOAuth2TokenExpirationConsistency verifies that expires_in values
// are consistent across different token operations.
func TestOAuth2TokenExpirationConsistency(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/expire/consistency"
	appID, _, _, clientSecret := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Consistency %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify"},
	)

	expiresInValues := []int{}

	for i := 0; i < 3; i++ {
		authCode, _ := authorizeOAuth2(
			t,
			client,
			endUser.Token,
			appID,
			redirectURI,
			[]string{"identify"},
			fmt.Sprintf("state-%d", i),
			"",
			"",
		)
		tokens := exchangeOAuth2AuthorizationCode(
			t, client,
			appID,
			clientSecret,
			authCode,
			redirectURI,
			"",
		)

		expiresInValues = append(expiresInValues, tokens.ExpiresIn)

		if i < 2 {
			time.Sleep(100 * time.Millisecond)
		}
	}

	firstValue := expiresInValues[0]
	for i, val := range expiresInValues {
		if abs(val-firstValue) > 5 {
			t.Errorf("expires_in[%d]=%d differs significantly from first value %d", i, val, firstValue)
		}
	}
}
