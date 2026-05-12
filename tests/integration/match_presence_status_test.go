/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

package integration

import (
	"encoding/json"
	"testing"
)

func TestMatchPresenceStatus(t *testing.T) {
	t.Run("matches correct user and status", func(t *testing.T) {
		expectedUserID := "123456789"
		expectedStatus := "online"

		testData := map[string]any{
			"user": map[string]any{
				"id": expectedUserID,
			},
			"status": expectedStatus,
		}

		rawData, _ := json.Marshal(testData)
		matcher := matchPresenceStatus(expectedUserID, expectedStatus)

		if !matcher(rawData) {
			t.Error("matcher should return true for matching user ID and status")
		}
	})

	t.Run("rejects wrong user ID", func(t *testing.T) {
		expectedUserID := "123456789"
		expectedStatus := "online"

		testData := map[string]any{
			"user": map[string]any{
				"id": "987654321",
			},
			"status": expectedStatus,
		}

		rawData, _ := json.Marshal(testData)
		matcher := matchPresenceStatus(expectedUserID, expectedStatus)

		if matcher(rawData) {
			t.Error("matcher should return false for wrong user ID")
		}
	})

	t.Run("rejects wrong status", func(t *testing.T) {
		expectedUserID := "123456789"
		expectedStatus := "online"

		testData := map[string]any{
			"user": map[string]any{
				"id": expectedUserID,
			},
			"status": "offline",
		}

		rawData, _ := json.Marshal(testData)
		matcher := matchPresenceStatus(expectedUserID, expectedStatus)

		if matcher(rawData) {
			t.Error("matcher should return false for wrong status")
		}
	})

	t.Run("rejects guild presence updates", func(t *testing.T) {
		expectedUserID := "123456789"
		expectedStatus := "online"

		testData := map[string]any{
			"user": map[string]any{
				"id": expectedUserID,
			},
			"status":   expectedStatus,
			"guild_id": "987654321",
		}

		rawData, _ := json.Marshal(testData)
		matcher := matchPresenceStatus(expectedUserID, expectedStatus)

		if matcher(rawData) {
			t.Error("matcher should return false for guild presence updates")
		}

		anyScopeMatcher := matchPresenceStatusAnyScope(expectedUserID, expectedStatus)
		if !anyScopeMatcher(rawData) {
			t.Error("any-scope matcher should return true for guild presence updates")
		}
	})
}
