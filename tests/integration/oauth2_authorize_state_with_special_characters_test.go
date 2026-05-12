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

// TestOAuth2AuthorizeStateWithSpecialCharacters verifies that state
// parameters with special characters are preserved correctly.
func TestOAuth2AuthorizeStateWithSpecialCharacters(t *testing.T) {
	client := newTestClient(t)
	appOwner := createTestAccount(t, client)
	endUser := createTestAccount(t, client)

	redirectURI := "https://example.com/state/special"
	appID, _, _, _ := createOAuth2Application(
		t, client, appOwner,
		fmt.Sprintf("Special State %d", time.Now().UnixNano()),
		[]string{redirectURI},
		[]string{"identify"},
	)

	testCases := []struct {
		name  string
		state string
	}{
		{"with dashes", "state-with-dashes-123"},
		{"with underscores", "state_with_underscores_456"},
		{"with periods", "state.with.periods.789"},
		{"with equals", "state=with=equals"},
		{"with encoded chars", "state%20with%20spaces"},
		{"base64-like", "c3RhdGUtYmFzZTY0LWxpa2U="},
		{"long state", "very-long-state-" + fmt.Sprintf("%d", time.Now().UnixNano()) + "-with-many-characters"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			_, returnedState := authorizeOAuth2(
				t,
				client,
				endUser.Token,
				appID,
				redirectURI,
				[]string{"identify"},
				tc.state,
				"",
				"",
			)

			if returnedState != tc.state {
				t.Fatalf("state not preserved: expected %q, got %q", tc.state, returnedState)
			}
		})
	}
}
