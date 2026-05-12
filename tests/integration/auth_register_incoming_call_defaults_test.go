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

const (
	incomingCallFriendsOnly = 8
)

func TestRegisterIncomingCallSettingsDefault(t *testing.T) {
	client := newTestClient(t)

	testCases := []struct {
		name     string
		opts     []registerOption
		expected int
	}{
		{
			name:     "adult defaults to friends only",
			expected: incomingCallFriendsOnly,
		},
		{
			name:     "minor defaults to friends only",
			opts:     []registerOption{withDateOfBirth(minorDateOfBirth())},
			expected: incomingCallFriendsOnly,
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			account := createTestAccount(t, client, tc.opts...)

			resp, err := client.getWithAuth("/users/@me/settings", account.Token)
			if err != nil {
				t.Fatalf("failed to fetch settings: %v", err)
			}
			assertStatus(t, resp, http.StatusOK)

			var payload struct {
				IncomingCallFlags int `json:"incoming_call_flags"`
			}
			decodeJSONResponse(t, resp, &payload)

			if payload.IncomingCallFlags != tc.expected {
				t.Fatalf("unexpected incoming_call_flags: got %d want %d", payload.IncomingCallFlags, tc.expected)
			}
		})
	}
}
